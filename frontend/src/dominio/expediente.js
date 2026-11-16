import { dataDeHoje, somarDias } from '../formatacao/horario.js'

const MARGEM_DO_ULTIMO_INICIO_EM_MINUTOS = 30
const LIMITE_DE_DIAS_NA_BUSCA = 14

const formatoDaHoraDeSaoPaulo = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function minutosDoTexto(hora) {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

export function minutosDeAgora() {
  return minutosDoTexto(formatoDaHoraDeSaoPaulo.format(new Date()))
}

export function diaEstaAberto(data, expediente) {
  const [ano, mes, dia] = data.split('-').map(Number)
  const diaDaSemana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()
  return expediente.dias_abertos.includes(diaDaSemana)
}

export function dataInicialDoAgendamento(expediente) {
  const hoje = dataDeHoje()
  const ultimoInicio = minutosDoTexto(expediente.fechamento) - MARGEM_DO_ULTIMO_INICIO_EM_MINUTOS
  if (diaEstaAberto(hoje, expediente) && minutosDeAgora() < ultimoInicio) return hoje

  for (let dias = 1; dias <= LIMITE_DE_DIAS_NA_BUSCA; dias += 1) {
    const candidata = somarDias(hoje, dias)
    if (diaEstaAberto(candidata, expediente)) return candidata
  }
  return hoje
}
