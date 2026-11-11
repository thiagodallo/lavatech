import { dataEHoraDoTexto, horaDoTexto } from '../formatacao/horario.js'
import ServicosDoAgendamento from './ServicosDoAgendamento.jsx'

function DadoOpcional({ rotulo, valor }) {
  if (!valor) return null

  return (
    <div className="detalhes-dado">
      <dt>{rotulo}</dt>
      <dd>{valor}</dd>
    </div>
  )
}

function textoOpcionalDeHorario(texto) {
  return texto ? dataEHoraDoTexto(texto) : null
}

export default function DadosDoAgendamento({ agendamento }) {
  const horario = `${dataEHoraDoTexto(agendamento.data_hora_agendada)} até ${horaDoTexto(agendamento.data_hora_fim_prevista)}`

  return (
    <dl className="detalhes-dados">
      <DadoOpcional rotulo="Horário" valor={horario} />
      <ServicosDoAgendamento agendamento={agendamento} />
      <DadoOpcional rotulo="Início" valor={textoOpcionalDeHorario(agendamento.data_hora_inicio)} />
      <DadoOpcional rotulo="Fim" valor={textoOpcionalDeHorario(agendamento.data_hora_fim)} />
      <DadoOpcional rotulo="Observações" valor={agendamento.observacoes} />
    </dl>
  )
}
