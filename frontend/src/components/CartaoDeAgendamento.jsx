import { horaDoTexto } from '../formatacao/horario.js'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './CartaoDeAgendamento.css'

export default function CartaoDeAgendamento({ agendamento }) {
  return (
    <li className="cartao-agendamento">
      <div className="cartao-corpo">
        <span className="cartao-horario">
          <span className="cartao-hora">{horaDoTexto(agendamento.data_hora_agendada)}</span>
          <span className="cartao-fim">até {horaDoTexto(agendamento.data_hora_fim_prevista)}</span>
        </span>
        <span className="cartao-dados">
          <span className="cartao-cliente">{agendamento.cliente.nome}</span>
          <span className="cartao-veiculo">
            {agendamento.veiculo.modelo}
            <span className="placa">{agendamento.veiculo.placa}</span>
          </span>
          <span className="cartao-servico">
            {agendamento.servico.nome} · {agendamento.vaga.identificacao}
          </span>
        </span>
        <PilulaDeStatus status={agendamento.status} />
      </div>
    </li>
  )
}
