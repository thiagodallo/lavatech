import { requisitar } from './clienteHttp.js'

export function listarProdutos() {
  return requisitar('/produtos')
}
