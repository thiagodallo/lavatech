import { requisitar } from './clienteHttp.js'

export function buscarPagamentoDoAgendamento(agendamentoId) {
  return requisitar(`/agendamentos/${agendamentoId}/pagamento`)
}

export function registrarPagamento(agendamentoId, dados) {
  return requisitar(`/agendamentos/${agendamentoId}/pagamento`, { metodo: 'POST', corpo: dados })
}

export function estornarPagamento(id) {
  return requisitar(`/pagamentos/${id}/estorno`, { metodo: 'PATCH' })
}
