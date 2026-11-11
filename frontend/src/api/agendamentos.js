import { requisitar } from './clienteHttp.js'

export function listarAgendamentosDoDia(data) {
  return requisitar(`/agendamentos?data=${data}`)
}
