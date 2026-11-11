import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as agendamentos from '../repositories/agendamento.repository.js'
import * as vagas from '../repositories/vaga.repository.js'

const AGENDAMENTO_NAO_ENCONTRADO = 'Agendamento não encontrado'
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
