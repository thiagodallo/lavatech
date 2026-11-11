import prisma from '../database/prisma.js'

const COM_DETALHES = {
  cliente: { select: { id: true, nome: true } },
  veiculo: { select: { id: true, modelo: true, placa: true } },
  servico: { select: { id: true, nome: true, duracao_minutos: true, preco: true } },
  vaga_lavagem: { select: { id: true, identificacao: true } },
}

export function listarDoDia(inicio, fim, status) {
  return prisma.agendamento.findMany({
    where: { data_hora_agendada: { gte: inicio, lt: fim }, status },
    include: COM_DETALHES,
    orderBy: [{ data_hora_agendada: 'asc' }, { id: 'asc' }],
  })
}

const STATUS_COM_ALERTA = ['agendado', 'aguardando']

export function listarParaAlerta(de, ate) {
  return prisma.agendamento.findMany({
    where: { status: { in: STATUS_COM_ALERTA }, data_hora_agendada: { gte: de, lte: ate } },
    include: COM_DETALHES,
    orderBy: [{ data_hora_agendada: 'asc' }, { id: 'asc' }],
  })
}

export function buscarPorId(id) {
  return prisma.agendamento.findUnique({ where: { id }, include: COM_DETALHES })
}
