import { requisitar } from './clienteHttp.js'

export function listarAgendamentosDoDia(data) {
  return requisitar(`/agendamentos?data=${data}`)
}

export function mudarStatusDoAgendamento(id, status, checklist) {
  const corpo = checklist ? { status, checklist } : { status }
  return requisitar(`/agendamentos/${id}/status`, { metodo: 'PATCH', corpo })
}

export function listarAlertas() {
  return requisitar('/agendamentos/alertas?minutos=15')
}

export function listarHistoricoDoAgendamento(id) {
  return requisitar(`/agendamentos/${id}/historico`)
}

export function cadastrarAgendamento(dados) {
  return requisitar('/agendamentos', { metodo: 'POST', corpo: dados })
}
