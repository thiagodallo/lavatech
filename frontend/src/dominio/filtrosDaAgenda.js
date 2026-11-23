export const filtrosDeStatus = [
  { valor: 'todos', rotulo: 'Todos', status: null },
  { valor: 'em_andamento', rotulo: 'Em andamento', status: ['em_andamento'] },
  { valor: 'a_fazer', rotulo: 'A fazer', status: ['agendado', 'aguardando'] },
  { valor: 'concluido', rotulo: 'Concluídos', status: ['concluido'] },
  { valor: 'cancelado', rotulo: 'Cancelados', status: ['cancelado'] },
]

function daVaga(agendamento, vagaId) {
  return vagaId === null || agendamento.vaga.id === vagaId
}

function noFiltroDeStatus(agendamento, filtroDeStatus) {
  const filtro = filtrosDeStatus.find((candidato) => candidato.valor === filtroDeStatus)
  return !filtro?.status || filtro.status.includes(agendamento.status)
}

export function filtrarAgendamentos(agendamentos, { filtroDeStatus, vagaId }) {
  return agendamentos.filter(
    (agendamento) => daVaga(agendamento, vagaId) && noFiltroDeStatus(agendamento, filtroDeStatus),
  )
}

export function contarPorFiltroDeStatus(agendamentos, vagaId) {
  const daVagaEscolhida = agendamentos.filter((agendamento) => daVaga(agendamento, vagaId))
  return Object.fromEntries(
    filtrosDeStatus.map((filtro) => [
      filtro.valor,
      daVagaEscolhida.filter((agendamento) => noFiltroDeStatus(agendamento, filtro.valor)).length,
    ]),
  )
}

function porHorario(primeiro, segundo) {
  return Date.parse(primeiro.data_hora_agendada) - Date.parse(segundo.data_hora_agendada)
}

export function agendamentoDeAgora(agendamentos, agora) {
  const emAtendimento = agendamentos.filter((agendamento) => agendamento.status === 'em_andamento').sort(porHorario)
  if (emAtendimento.length > 0) return emAtendimento[0]

  const aFazer = agendamentos
    .filter((agendamento) => ['agendado', 'aguardando'].includes(agendamento.status))
    .sort(porHorario)
  return aFazer.find((agendamento) => Date.parse(agendamento.data_hora_agendada) >= agora.getTime()) ?? aFazer[0] ?? null
}
