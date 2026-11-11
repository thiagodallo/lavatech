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
