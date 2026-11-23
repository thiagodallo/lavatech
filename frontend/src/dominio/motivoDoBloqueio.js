import { formatarDiaEMes } from '../formatacao/horario.js'

export function motivoDoBloqueioDeIniciar({ diaDoAgendamento, hoje, ocupadaAte }) {
  if (diaDoAgendamento > hoje) return `Só dá para iniciar no dia do agendamento (${formatarDiaEMes(diaDoAgendamento)}).`
  if (ocupadaAte) return `Vaga ocupada até ${ocupadaAte}.`
  return null
}
