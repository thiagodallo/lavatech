import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as clientes from '../repositories/cliente.repository.js'

const CLIENTE_NAO_ENCONTRADO = 'Cliente não encontrado'
const TELEFONE_JA_CADASTRADO = 'Telefone já cadastrado'

function formatarCliente({ veiculo, ...cliente }) {
  return { ...cliente, veiculos: veiculo }
}

async function exigirCliente(id) {
  const cliente = await clientes.buscarPorId(id)
  if (!cliente) {
    throw new ErroDeAplicacao(404, CLIENTE_NAO_ENCONTRADO)
  }
  return cliente
}

async function exigirTelefoneLivre(telefone, idDoCliente) {
  const existente = await clientes.buscarPorTelefone(telefone)
  if (existente && existente.id !== idDoCliente) {
    throw new ErroDeAplicacao(409, TELEFONE_JA_CADASTRADO)
  }
}

export async function listarClientes(busca) {
  const encontrados = await clientes.listarComVeiculos(busca)
  return encontrados.map(formatarCliente)
}

export async function cadastrarCliente(dados) {
  await exigirTelefoneLivre(dados.telefone)
  return formatarCliente(await clientes.criar(dados))
}

export async function editarCliente(id, dados) {
  await exigirCliente(id)
  await exigirTelefoneLivre(dados.telefone, id)
  return formatarCliente(await clientes.atualizar(id, dados))
}
