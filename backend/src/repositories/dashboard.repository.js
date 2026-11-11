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
      servico: { select: { id: true, nome: true } },
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
    SELECT s.id AS servico_id, s.nome, COUNT(*)::int AS quantidade, COALESCE(SUM(p.valor), 0) AS receita
    FROM agendamento a
    JOIN servico s ON s.id = a.servico_id
    LEFT JOIN pagamento p ON p.agendamento_id = a.id AND p.status = 'pago'
    WHERE a.status = 'concluido'
      AND a.data_hora_agendada >= ${de}::date AND a.data_hora_agendada < ${ate}::date + 1
    GROUP BY s.id, s.nome
    ORDER BY quantidade DESC, receita DESC, s.nome
    LIMIT ${limite}`
}
