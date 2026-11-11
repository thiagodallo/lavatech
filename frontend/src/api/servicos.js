import { requisitar } from './clienteHttp.js'

export function listarServicos() {
  return requisitar('/servicos')
}

export function cadastrarServico(dados) {
  return requisitar('/servicos', { metodo: 'POST', corpo: dados })
}

export function editarServico(id, dados) {
  return requisitar(`/servicos/${id}`, { metodo: 'PUT', corpo: dados })
}
