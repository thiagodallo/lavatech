import prisma from '../database/prisma.js'

export function buscarPorAgendamento(agendamentoId) {
  return prisma.checklist_qualidade.findUnique({
    where: { agendamento_id: agendamentoId },
    include: { funcionario: { select: { id: true, nome: true } } },
  })
}

const COM_DETALHES = {
  funcionario: { select: { id: true, nome: true } },
  agendamento: {
    select: {
      id: true,
      data_hora_agendada: true,
      cliente: { select: { id: true, nome: true } },
      veiculo: { select: { id: true, modelo: true, placa: true } },
      agendamento_servico: {
        select: { servico_id: true, servico: { select: { nome: true } } },
        orderBy: { id: 'asc' },
      },
    },
  },
}

export function listar({ intervalo, resultado, limite }) {
  return prisma.checklist_qualidade.findMany({
    where: { hora_fim: intervalo, resultado },
    include: COM_DETALHES,
    orderBy: [{ hora_fim: 'desc' }, { id: 'desc' }],
    take: limite,
  })
}
