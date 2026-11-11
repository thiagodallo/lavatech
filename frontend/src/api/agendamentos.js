import { requisitar } from './clienteHttp.js'

export function listarAgendamentosDoDia(data) {
  return requisitar(`/agendamentos?data=${data}`)
}

export function mudarStatusDoAgendamento(id, status) {
  return requisitar(`/agendamentos/${id}/status`, { metodo: 'PATCH', corpo: { status } })
}

export function listarAlertas() {
  return requisitar('/agendamentos/alertas?minutos=15')
}
