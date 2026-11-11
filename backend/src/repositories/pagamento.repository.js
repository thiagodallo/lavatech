import prisma from '../database/prisma.js'

export function buscarPorId(id) {
  return prisma.pagamento.findUnique({ where: { id } })
}

export function buscarPorAgendamento(agendamentoId) {
  return prisma.pagamento.findUnique({ where: { agendamento_id: agendamentoId } })
}

export function criar({ agendamentoId, valor, formaPagamento, status, pagoEm }) {
  return prisma.pagamento.create({
    data: {
      agendamento_id: agendamentoId,
      valor,
      forma_pagamento: formaPagamento,
      status,
      pago_em: pagoEm,
    },
  })
}

export async function estornar(id) {
  const { count } = await prisma.pagamento.updateMany({
    where: { id, status: 'pago' },
    data: { status: 'estornado' },
  })
  if (count === 0) {
    return null
  }
  return prisma.pagamento.findUnique({ where: { id } })
}
