import { requisitar } from './clienteHttp.js'

export function buscarExpediente() {
  return requisitar('/expediente')
}
