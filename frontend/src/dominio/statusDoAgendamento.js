export const rotulosDeStatus = {
  agendado: 'Agendado',
  aguardando: 'Aguardando',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  no_show: 'Não compareceu',
}

const clienteChegou = { status: 'aguardando', rotulo: 'Cliente chegou' }
const iniciar = { status: 'em_andamento', rotulo: 'Iniciar' }
const concluir = { status: 'concluido', rotulo: 'Concluir' }
const cancelar = { status: 'cancelado', rotulo: 'Cancelar', confirmacao: 'Confirmar cancelamento' }
const naoCompareceu = {
  status: 'no_show',
  rotulo: 'Não compareceu',
  confirmacao: 'Confirmar não comparecimento',
}

const acoesPorStatus = {
  agendado: [clienteChegou, iniciar, cancelar, naoCompareceu],
  aguardando: [iniciar, cancelar, naoCompareceu],
  em_andamento: [concluir, cancelar],
}

export function acoesDoStatus(status) {
  return acoesPorStatus[status] ?? []
}

const statusQueAceitamPagamento = ['em_andamento', 'concluido']

export function aceitaPagamento(status) {
  return statusQueAceitamPagamento.includes(status)
}
