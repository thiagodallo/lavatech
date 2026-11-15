const statusQueAguardamInicio = ['agendado', 'aguardando']

function minutosDesde(texto, agora) {
  return Math.floor((agora - new Date(texto)) / 60000)
}

export function minutosDeAtraso(agendamento, agora) {
  if (!statusQueAguardamInicio.includes(agendamento.status)) return 0
  return Math.max(0, minutosDesde(agendamento.data_hora_agendada, agora))
}

export function minutosEmAtendimento(agendamento, agora) {
  if (agendamento.status !== 'em_andamento' || !agendamento.data_hora_inicio) return 0
  return Math.max(0, minutosDesde(agendamento.data_hora_inicio, agora))
}

export function textoDeDuracao(minutos) {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`
}
