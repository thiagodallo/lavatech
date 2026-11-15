export const rotulosDeStatus = {
  agendado: 'Agendado',
  aguardando: 'Aguardando',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  no_show: 'Não compareceu',
}

const iniciar = { status: 'em_andamento', rotulo: 'Iniciar' }
const concluir = { status: 'concluido', rotulo: 'Concluir' }
const cancelar = { status: 'cancelado', rotulo: 'Cancelar', confirmacao: 'Confirmar cancelamento' }

const acoesPorStatus = {
  agendado: [iniciar, cancelar],
  aguardando: [iniciar, cancelar],
  em_andamento: [concluir, cancelar],
}

export function acoesDoStatus(status) {
  return acoesPorStatus[status] ?? []
}

const statusQueAceitamPagamento = ['em_andamento', 'concluido']

export function aceitaPagamento(status) {
  return statusQueAceitamPagamento.includes(status)
}
