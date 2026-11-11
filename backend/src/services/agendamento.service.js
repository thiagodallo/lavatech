import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as agendamentos from '../repositories/agendamento.repository.js'
import * as clientes from '../repositories/cliente.repository.js'
import * as servicos from '../repositories/servico.repository.js'
import * as vagas from '../repositories/vaga.repository.js'
import * as veiculos from '../repositories/veiculo.repository.js'

const AGENDAMENTO_NAO_ENCONTRADO = 'Agendamento não encontrado'
const CLIENTE_NAO_ENCONTRADO = 'Cliente não encontrado'
const VEICULO_FORA_DO_CLIENTE = 'O veículo não pertence a esse cliente'
const SERVICO_NAO_ENCONTRADO = 'Serviço não encontrado'
const SERVICO_INATIVO = 'Serviço inativo'
const VAGA_NAO_ENCONTRADA = 'Vaga não encontrada'
const VAGA_INATIVA = 'Vaga inativa'
const VAGA_OCUPADA = 'Vaga ocupada nesse horário'
const STATUS_INICIAL = 'agendado'
const MAIOR_DURACAO_EM_MINUTOS = 720
const REGISTRO_DUPLICADO = 'P2002'
const TRANSICAO_NEGADA = 'Transição de status não permitida'
const STATUS_JA_ALTERADO = 'O status do agendamento acabou de ser alterado, atualize a agenda'
const TRANSICOES_PERMITIDAS = {
  agendado: ['aguardando', 'em_andamento', 'cancelado', 'no_show'],
  aguardando: ['em_andamento', 'cancelado', 'no_show'],
  em_andamento: ['concluido', 'cancelado'],
  concluido: [],
  cancelado: [],
  no_show: [],
}
const MS_POR_MINUTO = 60 * 1000
const MS_POR_DIA = 24 * 60 * MS_POR_MINUTO
const DESLOCAMENTO_DO_FUSO_MS = 3 * 60 * MS_POR_MINUTO
const SUFIXO_DO_FUSO = '-03:00'

export function listarVagasAtivas() {
  return vagas.listarAtivas()
}

function relogioDoBanco(instante) {
  return new Date(instante.getTime() - DESLOCAMENTO_DO_FUSO_MS)
}

function somarMinutos(horario, minutos) {
  return new Date(horario.getTime() + minutos * MS_POR_MINUTO)
}

function formatarHorario(horarioDoBanco) {
  return `${horarioDoBanco.toISOString().slice(0, 19)}${SUFIXO_DO_FUSO}`
}

function formatarHorarioOpcional(horarioDoBanco) {
  return horarioDoBanco ? formatarHorario(horarioDoBanco) : null
}

function diaDeHoje() {
  return relogioDoBanco(new Date()).toISOString().slice(0, 10)
}

function formatarAgendamento(agendamento) {
  const { servico } = agendamento
  const fimPrevisto = somarMinutos(agendamento.data_hora_agendada, servico.duracao_minutos)
  return {
    id: agendamento.id,
    data_hora_agendada: formatarHorario(agendamento.data_hora_agendada),
    data_hora_fim_prevista: formatarHorario(fimPrevisto),
    data_hora_inicio: formatarHorarioOpcional(agendamento.data_hora_inicio),
    data_hora_fim: formatarHorarioOpcional(agendamento.data_hora_fim),
    status: agendamento.status,
    observacoes: agendamento.observacoes,
    cliente: agendamento.cliente,
    veiculo: agendamento.veiculo,
    servico: { ...servico, preco: Number(servico.preco) },
    vaga: agendamento.vaga_lavagem,
  }
}

export async function listarAgendaDoDia({ data, status }) {
  const inicio = new Date(`${data ?? diaDeHoje()}T00:00:00.000Z`)
  const fim = new Date(inicio.getTime() + MS_POR_DIA)
  const encontrados = await agendamentos.listarDoDia(inicio, fim, status)
  return encontrados.map(formatarAgendamento)
}

function minutosAte(horario, agora) {
  return Math.ceil((horario.getTime() - agora.getTime()) / MS_POR_MINUTO)
}

export async function listarAlertas({ minutos }) {
  const agora = relogioDoBanco(new Date())
  const limite = somarMinutos(agora, minutos)
  const encontrados = await agendamentos.listarParaAlerta(agora, limite)
  return encontrados.map((agendamento) => ({
    ...formatarAgendamento(agendamento),
    minutos_restantes: minutosAte(agendamento.data_hora_agendada, agora),
  }))
}

async function exigirAgendamento(id) {
  const agendamento = await agendamentos.buscarPorId(id)
  if (!agendamento) {
    throw new ErroDeAplicacao(404, AGENDAMENTO_NAO_ENCONTRADO)
  }
  return agendamento
}

export async function buscarAgendamento(id) {
  return formatarAgendamento(await exigirAgendamento(id))
}

async function exigirReferenciasValidas({ cliente_id, veiculo_id, servico_id, vaga_id }) {
  if (!(await clientes.buscarPorId(cliente_id))) {
    throw new ErroDeAplicacao(404, CLIENTE_NAO_ENCONTRADO)
  }
  const veiculosDoCliente = await veiculos.listarPorCliente(cliente_id)
  if (!veiculosDoCliente.some((veiculo) => veiculo.id === veiculo_id)) {
    throw new ErroDeAplicacao(400, VEICULO_FORA_DO_CLIENTE)
  }
  const servico = await servicos.buscarPorId(servico_id)
  if (!servico) {
    throw new ErroDeAplicacao(404, SERVICO_NAO_ENCONTRADO)
  }
  if (!servico.ativo) {
    throw new ErroDeAplicacao(400, SERVICO_INATIVO)
  }
  const vaga = await vagas.buscarPorId(vaga_id)
  if (!vaga) {
    throw new ErroDeAplicacao(404, VAGA_NAO_ENCONTRADA)
  }
  if (!vaga.ativo) {
    throw new ErroDeAplicacao(400, VAGA_INATIVA)
  }
  return servico
}

async function exigirVagaLivre(vagaId, inicio, duracaoEmMinutos) {
  const fim = somarMinutos(inicio, duracaoEmMinutos)
  const desde = somarMinutos(inicio, -MAIOR_DURACAO_EM_MINUTOS)
  const candidatos = await agendamentos.listarNaVaga(vagaId, desde, fim)
  const sobrepoe = candidatos.some(
    (existente) => somarMinutos(existente.data_hora_agendada, existente.servico.duracao_minutos) > inicio,
  )
  if (sobrepoe) {
    throw new ErroDeAplicacao(409, VAGA_OCUPADA)
  }
}

async function gravarAgendamento(dados) {
  try {
    return await agendamentos.criar(dados)
  } catch (erro) {
    if (erro.code === REGISTRO_DUPLICADO) {
      throw new ErroDeAplicacao(409, VAGA_OCUPADA)
    }
    throw erro
  }
}

export async function cadastrarAgendamento(dados, funcionarioId) {
  const servico = await exigirReferenciasValidas(dados)
  const horario = relogioDoBanco(dados.data_hora_agendada)
  await exigirVagaLivre(dados.vaga_id, horario, servico.duracao_minutos)
  const criado = await gravarAgendamento({
    dados,
    horario,
    status: STATUS_INICIAL,
    funcionarioId,
    agora: relogioDoBanco(new Date()),
  })
  return formatarAgendamento(criado)
}

export async function mudarStatusDoAgendamento(id, statusNovo, funcionarioId) {
  const { status: statusAnterior } = await exigirAgendamento(id)
  if (!TRANSICOES_PERMITIDAS[statusAnterior].includes(statusNovo)) {
    throw new ErroDeAplicacao(409, `${TRANSICAO_NEGADA}: de ${statusAnterior} para ${statusNovo}`)
  }
  const atualizado = await agendamentos.mudarStatus({
    id,
    statusAnterior,
    statusNovo,
    funcionarioId,
    agora: relogioDoBanco(new Date()),
  })
  if (!atualizado) {
    throw new ErroDeAplicacao(409, STATUS_JA_ALTERADO)
  }
  return formatarAgendamento(atualizado)
}
