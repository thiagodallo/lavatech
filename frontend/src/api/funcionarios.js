import { requisitar } from './clienteHttp.js'

export function listarFuncionarios() {
  return requisitar('/funcionarios')
}

export function cadastrarFuncionario(dados) {
  return requisitar('/funcionarios', { metodo: 'POST', corpo: dados })
}

export function editarFuncionario(id, dados) {
  return requisitar(`/funcionarios/${id}`, { metodo: 'PUT', corpo: dados })
}
