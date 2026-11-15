import { horaDoTexto } from '../formatacao/horario.js'

const ABERTURA_EM_MINUTOS = 8 * 60
const ULTIMO_INICIO_EM_MINUTOS = 17 * 60 + 30
const PASSO_EM_MINUTOS = 30
const DURACAO_MINIMA_EM_MINUTOS = 30
const STATUS_QUE_LIBERAM_A_VAGA = ['cancelado', 'no_show']

const formatoDaHoraDeSaoPaulo = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function minutosDoTexto(hora) {
  const [horas, minutos] = hora.split(':').map(Number)
  return horas * 60 + minutos
}

function textoDosMinutos(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0')
  const resto = String(minutos % 60).padStart(2, '0')
  return `${horas}:${resto}`
}

function minutosDeAgora() {
  return minutosDoTexto(formatoDaHoraDeSaoPaulo.format(new Date()))
}

function intervalosOcupados(agendamentosDaVaga) {
  return agendamentosDaVaga
    .filter((agendamento) => !STATUS_QUE_LIBERAM_A_VAGA.includes(agendamento.status))
    .map((agendamento) => ({
      inicio: minutosDoTexto(horaDoTexto(agendamento.data_hora_agendada)),
      fim: minutosDoTexto(horaDoTexto(agendamento.data_hora_fim_prevista)),
    }))
}

export function horariosDaVaga({ agendamentosDaVaga, duracaoMinutos, diaDeHoje }) {
  const duracao = Math.max(duracaoMinutos, DURACAO_MINIMA_EM_MINUTOS)
  const ocupados = intervalosOcupados(agendamentosDaVaga)
  const agora = diaDeHoje ? minutosDeAgora() : -1
  const horarios = []

  for (let inicio = ABERTURA_EM_MINUTOS; inicio <= ULTIMO_INICIO_EM_MINUTOS; inicio += PASSO_EM_MINUTOS) {
    const fim = inicio + duracao
    const sobrepoe = ocupados.some((ocupado) => ocupado.inicio < fim && ocupado.fim > inicio)
    horarios.push({ hora: textoDosMinutos(inicio), livre: !sobrepoe && inicio > agora })
  }
  return horarios
}
