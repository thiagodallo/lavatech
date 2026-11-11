import { requisitar } from './clienteHttp.js'

export function listarProdutos() {
  return requisitar('/produtos')
}

export function cadastrarProduto(dados) {
  return requisitar('/produtos', { metodo: 'POST', corpo: dados })
}

export function editarProduto(id, dados) {
  return requisitar(`/produtos/${id}`, { metodo: 'PUT', corpo: dados })
}
