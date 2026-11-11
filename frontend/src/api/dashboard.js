import { requisitar } from './clienteHttp.js'

export function buscarResumoDoDia(data) {
  return requisitar(`/dashboard/dia?data=${data}`)
}

export function buscarResumoDoPeriodo({ de, ate }) {
  return requisitar(`/dashboard/periodo?de=${de}&ate=${ate}`)
}
