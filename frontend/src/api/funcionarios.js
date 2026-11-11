import { requisitar } from './clienteHttp.js'

export function listarFuncionarios() {
  return requisitar('/funcionarios')
}
