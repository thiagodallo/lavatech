import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as clientes from '../repositories/cliente.repository.js'
import * as veiculos from '../repositories/veiculo.repository.js'

const CLIENTE_NAO_ENCONTRADO = 'Cliente não encontrado'
const TELEFONE_JA_CADASTRADO = 'Telefone já cadastrado'
const PLACA_JA_CADASTRADA = 'Placa já cadastrada'
const VEICULO_NAO_ENCONTRADO = 'Veículo não encontrado'
const VEICULO_COM_AGENDAMENTOS = 'Esse veículo tem agendamentos e não pode ser removido'

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

export async function listarVeiculosDoCliente(clienteId) {
  await exigirCliente(clienteId)
  return veiculos.listarPorCliente(clienteId)
}

async function exigirVeiculoDoCliente(clienteId, veiculoId) {
  await exigirCliente(clienteId)
  const veiculo = await veiculos.buscarPorId(veiculoId)
  if (!veiculo || veiculo.cliente_id !== clienteId) {
    throw new ErroDeAplicacao(404, VEICULO_NAO_ENCONTRADO)
  }
  return veiculo
}

export async function editarVeiculo(clienteId, veiculoId, dados) {
  await exigirVeiculoDoCliente(clienteId, veiculoId)
  const mesmaPlaca = await veiculos.buscarPorPlaca(dados.placa)
  if (mesmaPlaca && mesmaPlaca.id !== veiculoId) {
    throw new ErroDeAplicacao(409, PLACA_JA_CADASTRADA)
  }
  return veiculos.atualizar(veiculoId, dados)
}

export async function removerVeiculo(clienteId, veiculoId) {
  await exigirVeiculoDoCliente(clienteId, veiculoId)
  if ((await veiculos.contarAgendamentos(veiculoId)) > 0) {
    throw new ErroDeAplicacao(409, VEICULO_COM_AGENDAMENTOS)
  }
  await veiculos.remover(veiculoId)
}

export async function cadastrarVeiculo(clienteId, dados) {
  await exigirCliente(clienteId)
  if (await veiculos.buscarPorPlaca(dados.placa)) {
    throw new ErroDeAplicacao(409, PLACA_JA_CADASTRADA)
  }
  return veiculos.criar(clienteId, dados)
}
