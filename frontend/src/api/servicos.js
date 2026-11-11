import { requisitar } from './clienteHttp.js'

export function listarServicos() {
  return requisitar('/servicos')
}
