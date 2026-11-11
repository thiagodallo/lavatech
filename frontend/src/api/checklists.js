import { requisitar } from './clienteHttp.js'

export function listarChecklists(data) {
  return requisitar(`/checklists?data=${data}`)
}

export async function buscarChecklistDoAgendamento(agendamentoId) {
  try {
    return await requisitar(`/agendamentos/${agendamentoId}/checklist`)
  } catch (erro) {
    if (erro.status === 404 && erro.message === 'Checklist não encontrado') return null
    throw erro
  }
}
