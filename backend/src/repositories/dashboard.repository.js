import prisma from '../database/prisma.js'

const STATUS_A_ATENDER = ['agendado', 'aguardando']

export async function contarPorStatus(inicio, fim) {
  const grupos = await prisma.agendamento.groupBy({
    by: ['status'],
    where: { data_hora_agendada: { gte: inicio, lt: fim } },
    _count: { _all: true },
  })
  return grupos.map((grupo) => ({ status: grupo.status, quantidade: grupo._count._all }))
}

export function buscarProximoAtendimento(agora) {
  return prisma.agendamento.findFirst({
    where: { status: { in: STATUS_A_ATENDER }, data_hora_agendada: { gte: agora } },
    orderBy: [{ data_hora_agendada: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      data_hora_agendada: true,
      status: true,
      cliente: { select: { id: true, nome: true } },
      veiculo: { select: { id: true, modelo: true, placa: true } },
      agendamento_servico: {
        select: { servico_id: true, servico: { select: { nome: true } } },
        orderBy: { id: 'asc' },
      },
      vaga_lavagem: { select: { id: true, identificacao: true } },
    },
  })
}

export function listarProdutosAbaixoDoMinimo() {
  return prisma.$queryRaw`
    SELECT id, nome, quantidade_atual, quantidade_minima, unidade_medida
    FROM produto
    WHERE quantidade_atual < quantidade_minima
    ORDER BY nome, id`
}

export async function contarVagasEmUso() {
  const [{ em_uso, total }] = await prisma.$queryRaw`
    SELECT
      (SELECT COUNT(DISTINCT vaga_id)::int FROM agendamento WHERE status = 'em_andamento') AS em_uso,
      (SELECT COUNT(*)::int FROM vaga_lavagem WHERE ativo) AS total`
  return { em_uso, total }
}

export async function somarFaturamento(de, ate) {
  const [resumo] = await prisma.$queryRaw`
    SELECT COALESCE(SUM(valor), 0) AS faturamento, COUNT(*)::int AS pagamentos
    FROM pagamento
    WHERE status = 'pago'
      AND pago_em >= ${de}::date AND pago_em < ${ate}::date + 1`
  return resumo
}

export function listarFaturamentoPorForma(de, ate) {
  return prisma.$queryRaw`
    SELECT forma_pagamento, SUM(valor) AS faturamento, COUNT(*)::int AS pagamentos
    FROM pagamento
    WHERE status = 'pago'
      AND pago_em >= ${de}::date AND pago_em < ${ate}::date + 1
    GROUP BY forma_pagamento`
}

export function listarFaturamentoPorDia(de, ate) {
  return prisma.$queryRaw`
    SELECT to_char(pago_em, 'YYYY-MM-DD') AS dia, SUM(valor) AS faturamento, COUNT(*)::int AS pagamentos
    FROM pagamento
    WHERE status = 'pago'
      AND pago_em >= ${de}::date AND pago_em < ${ate}::date + 1
    GROUP BY 1`
}

export function listarServicosMaisVendidos(de, ate, limite) {
  return prisma.$queryRaw`
    SELECT s.id AS servico_id, s.nome, COUNT(*)::int AS quantidade, SUM(i.preco) AS receita
    FROM agendamento a
    JOIN agendamento_servico i ON i.agendamento_id = a.id
    JOIN servico s ON s.id = i.servico_id
    WHERE a.status = 'concluido'
      AND a.data_hora_agendada >= ${de}::date AND a.data_hora_agendada < ${ate}::date + 1
    GROUP BY s.id, s.nome
    ORDER BY quantidade DESC, receita DESC, s.nome
    LIMIT ${limite}`
}

export async function contarClientesNovosERecorrentes(de, ate) {
  const [contagem] = await prisma.$queryRaw`
    SELECT
      COUNT(*) FILTER (WHERE primeiro_agendamento >= ${de}::date)::int AS novos,
      COUNT(*) FILTER (WHERE primeiro_agendamento < ${de}::date)::int AS recorrentes
    FROM (
      SELECT cliente_id, MIN(data_hora_agendada) AS primeiro_agendamento
      FROM agendamento
      WHERE status <> 'cancelado'
      GROUP BY cliente_id
      HAVING BOOL_OR(data_hora_agendada >= ${de}::date AND data_hora_agendada < ${ate}::date + 1)
    ) AS clientes_do_periodo`
  return contagem
}

export async function contarCancelamentos(de, ate) {
  const [contagem] = await prisma.$queryRaw`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'cancelado')::int AS cancelados,
      COUNT(*) FILTER (WHERE status = 'no_show')::int AS no_shows
    FROM agendamento
    WHERE data_hora_agendada >= ${de}::date AND data_hora_agendada < ${ate}::date + 1`
  return contagem
}

export function listarTempoMedioPorServico(de, ate) {
  return prisma.$queryRaw`
    SELECT
      s.id AS servico_id,
      s.nome,
      s.duracao_minutos AS duracao_prevista_minutos,
      COUNT(*)::int AS atendimentos,
      AVG(parte.minutos_reais * parte.duracao_minutos / parte.minutos_previstos) AS tempo_medio_minutos
    FROM (
      SELECT
        i.servico_id,
        i.duracao_minutos,
        EXTRACT(EPOCH FROM (a.data_hora_fim - a.data_hora_inicio)) / 60 AS minutos_reais,
        SUM(i.duracao_minutos) OVER (PARTITION BY a.id) AS minutos_previstos
      FROM agendamento a
      JOIN agendamento_servico i ON i.agendamento_id = a.id
      WHERE a.status = 'concluido'
        AND a.data_hora_inicio IS NOT NULL
        AND a.data_hora_fim IS NOT NULL
        AND a.data_hora_agendada >= ${de}::date AND a.data_hora_agendada < ${ate}::date + 1
    ) AS parte
    JOIN servico s ON s.id = parte.servico_id
    GROUP BY s.id, s.nome, s.duracao_minutos
    ORDER BY s.nome, s.id`
}

export function listarAgendamentosPorHora(de, ate) {
  return prisma.$queryRaw`
    SELECT EXTRACT(HOUR FROM data_hora_agendada)::int AS hora, COUNT(*)::int AS agendamentos
    FROM agendamento
    WHERE status <> 'cancelado'
      AND data_hora_agendada >= ${de}::date AND data_hora_agendada < ${ate}::date + 1
    GROUP BY 1`
}
