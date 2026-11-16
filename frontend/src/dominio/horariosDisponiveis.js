import { horaDoTexto } from '../formatacao/horario.js'
import { minutosDeAgora, minutosDoTexto } from './expediente.js'

const PASSO_EM_MINUTOS = 30
const DURACAO_MINIMA_EM_MINUTOS = 30
const STATUS_QUE_LIBERAM_A_VAGA = ['cancelado']

function textoDosMinutos(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0')
  const resto = String(minutos % 60).padStart(2, '0')
  return `${horas}:${resto}`
}

function intervalosOcupados(agendamentosDaVaga) {
  return agendamentosDaVaga
    .filter((agendamento) => !STATUS_QUE_LIBERAM_A_VAGA.includes(agendamento.status))
    .map((agendamento) => ({
      inicio: minutosDoTexto(horaDoTexto(agendamento.data_hora_agendada)),
      fim: minutosDoTexto(horaDoTexto(agendamento.data_hora_fim_prevista)),
    }))
}

export function horariosDaVaga({ agendamentosDaVaga, duracaoMinutos, diaDeHoje, expediente }) {
  const duracao = Math.max(duracaoMinutos, DURACAO_MINIMA_EM_MINUTOS)
  const ocupados = intervalosOcupados(agendamentosDaVaga)
  const agora = diaDeHoje ? minutosDeAgora() : -1
  const fechamento = minutosDoTexto(expediente.fechamento)
  const horarios = []

  for (let inicio = minutosDoTexto(expediente.abertura); inicio + duracao <= fechamento; inicio += PASSO_EM_MINUTOS) {
    const fim = inicio + duracao
    const sobrepoe = ocupados.some((ocupado) => ocupado.inicio < fim && ocupado.fim > inicio)
    horarios.push({ hora: textoDosMinutos(inicio), livre: !sobrepoe && inicio > agora })
  }
  return horarios
}
