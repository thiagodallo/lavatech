import { requisitar } from './clienteHttp.js'

export function listarVagas() {
  return requisitar('/vagas')
}
