import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { formatarHorario, formatarHorarioOpcional } from '../horario/horarioDeSaoPaulo.js'
import * as agendamentos from '../repositories/agendamento.repository.js'
import * as checklists from '../repositories/checklist.repository.js'
import { ITENS_DO_CHECKLIST } from '../schemas/checklist.schema.js'

const AGENDAMENTO_NAO_ENCONTRADO = 'Agendamento não encontrado'
const CHECKLIST_NAO_ENCONTRADO = 'Checklist não encontrado'
const LIMITE_DA_LISTA = 100
const MS_POR_DIA = 24 * 60 * 60 * 1000

function formatarChecklist(checklist) {
  const itens = Object.fromEntries(ITENS_DO_CHECKLIST.map((item) => [item, checklist[item]]))
  return {
    id: checklist.id,
    agendamento_id: checklist.agendamento_id,
    ...itens,
    resultado: checklist.resultado,
    descricao_problema: checklist.descricao_problema,
    houve_problema: checklist.houve_problema,
    necessita_retrabalho: checklist.necessita_retrabalho,
    hora_inicio: formatarHorarioOpcional(checklist.hora_inicio),
    hora_fim: formatarHorarioOpcional(checklist.hora_fim),
    funcionario: checklist.funcionario,
  }
}

export async function buscarChecklistDoAgendamento(agendamentoId) {
  if (!(await agendamentos.buscarPorId(agendamentoId))) {
    throw new ErroDeAplicacao(404, AGENDAMENTO_NAO_ENCONTRADO)
  }
  const checklist = await checklists.buscarPorAgendamento(agendamentoId)
  if (!checklist) {
    throw new ErroDeAplicacao(404, CHECKLIST_NAO_ENCONTRADO)
  }
  return formatarChecklist(checklist)
}

function formatarServicosDoChecklist(itens) {
  return itens.map((item) => ({ id: item.servico_id, nome: item.servico.nome }))
}

function formatarChecklistDaLista(checklist) {
  const { agendamento_servico: itens, ...agendamento } = checklist.agendamento
  return {
    id: checklist.id,
    resultado: checklist.resultado,
    houve_problema: checklist.houve_problema,
    necessita_retrabalho: checklist.necessita_retrabalho,
    hora_fim: formatarHorarioOpcional(checklist.hora_fim),
    itens_nao_conformes: ITENS_DO_CHECKLIST.filter((item) => !checklist[item]),
    funcionario: checklist.funcionario,
    agendamento: {
      ...agendamento,
      data_hora_agendada: formatarHorario(agendamento.data_hora_agendada),
      servicos: formatarServicosDoChecklist(itens),
    },
  }
}

function intervaloDoDia(data) {
  if (!data) {
    return undefined
  }
  const inicio = new Date(`${data}T00:00:00.000Z`)
  return { gte: inicio, lt: new Date(inicio.getTime() + MS_POR_DIA) }
}

export async function listarChecklists({ data, resultado }) {
  const encontrados = await checklists.listar({
    intervalo: intervaloDoDia(data),
    resultado,
    limite: LIMITE_DA_LISTA,
  })
  return encontrados.map(formatarChecklistDaLista)
}
