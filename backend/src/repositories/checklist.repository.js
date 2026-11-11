import prisma from '../database/prisma.js'

export function buscarPorAgendamento(agendamentoId) {
  return prisma.checklist_qualidade.findUnique({
    where: { agendamento_id: agendamentoId },
    include: { funcionario: { select: { id: true, nome: true } } },
  })
}
