import { requisitar } from './clienteHttp.js'

export function buscarResumoDoDia(data) {
  return requisitar(`/dashboard/dia?data=${data}`)
}
