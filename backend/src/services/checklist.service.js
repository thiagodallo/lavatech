import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { formatarHorarioOpcional } from '../horario/horarioDeSaoPaulo.js'
import * as agendamentos from '../repositories/agendamento.repository.js'
import * as checklists from '../repositories/checklist.repository.js'
import { ITENS_DO_CHECKLIST } from '../schemas/checklist.schema.js'

const AGENDAMENTO_NAO_ENCONTRADO = 'Agendamento não encontrado'
const CHECKLIST_NAO_ENCONTRADO = 'Checklist não encontrado'

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
