import { requisitar } from './clienteHttp.js'

export function listarClientes(busca) {
  const parametros = busca ? `?busca=${encodeURIComponent(busca)}` : ''
  return requisitar(`/clientes${parametros}`)
}

export function cadastrarCliente(dados) {
  return requisitar('/clientes', { metodo: 'POST', corpo: dados })
}

export function editarCliente(id, dados) {
  return requisitar(`/clientes/${id}`, { metodo: 'PUT', corpo: dados })
}

export function cadastrarVeiculo(clienteId, dados) {
  return requisitar(`/clientes/${clienteId}/veiculos`, { metodo: 'POST', corpo: dados })
}
