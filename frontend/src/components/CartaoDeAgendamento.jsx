import { acoesDoStatus } from '../dominio/statusDoAgendamento.js'
import { horaDoTexto } from '../formatacao/horario.js'
import BotoesDeStatus from './BotoesDeStatus.jsx'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './CartaoDeAgendamento.css'

export default function CartaoDeAgendamento({ agendamento, selecionado, ocupado, mensagemDeErro, aoAbrir, aoMudarStatus }) {
  const acoes = acoesDoStatus(agendamento.status)

  return (
    <li className="cartao-agendamento">
      <button
        type="button"
        className="cartao-corpo"
        aria-current={selecionado ? 'true' : undefined}
        onClick={aoAbrir}
      >
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
      </button>

      {(acoes.length > 0 || mensagemDeErro) && (
        <div className="cartao-rodape">
          {mensagemDeErro && (
            <p className="cartao-erro" role="alert">
              {mensagemDeErro}
            </p>
          )}
          {acoes.length > 0 && (
            <BotoesDeStatus acoes={acoes} desabilitado={ocupado} aoEscolher={aoMudarStatus} />
          )}
        </div>
      )}
    </li>
  )
}
