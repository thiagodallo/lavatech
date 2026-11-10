import * as clientes from '../repositories/cliente.repository.js'

function formatarCliente({ veiculo, ...cliente }) {
  return { ...cliente, veiculos: veiculo }
}

export async function listarClientes(busca) {
  const encontrados = await clientes.listarComVeiculos(busca)
  return encontrados.map(formatarCliente)
}
