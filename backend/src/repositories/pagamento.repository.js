import prisma from '../database/prisma.js'

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
