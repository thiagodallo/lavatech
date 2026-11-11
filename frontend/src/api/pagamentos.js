import { requisitar } from './clienteHttp.js'

export async function buscarPagamentoDoAgendamento(agendamentoId) {
  try {
    return await requisitar(`/agendamentos/${agendamentoId}/pagamento`)
  } catch (erro) {
    if (erro.status === 404 && erro.message === 'Pagamento não encontrado') return null
    throw erro
  }
}

export function registrarPagamento(agendamentoId, dados) {
  return requisitar(`/agendamentos/${agendamentoId}/pagamento`, { metodo: 'POST', corpo: dados })
}

export function estornarPagamento(id) {
  return requisitar(`/pagamentos/${id}/estorno`, { metodo: 'PATCH' })
}
