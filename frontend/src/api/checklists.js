import { requisitar } from './clienteHttp.js'

export function listarChecklists(data) {
  return requisitar(`/checklists?data=${data}`)
}
