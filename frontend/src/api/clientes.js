import { requisitar } from './clienteHttp.js'

export function listarClientes(busca) {
  const parametros = busca ? `?busca=${encodeURIComponent(busca)}` : ''
  return requisitar(`/clientes${parametros}`)
}
