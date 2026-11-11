import { acoesDoStatus } from '../dominio/statusDoAgendamento.js'
import { horaDoTexto } from '../formatacao/horario.js'
import BotoesDeStatus from './BotoesDeStatus.jsx'
import LinhaDeServicos from './LinhaDeServicos.jsx'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './CartaoDeAgendamento.css'

function HorarioDoCartao({ agendamento }) {
  return (
    <span className="cartao-horario">
      <span className="cartao-hora">{horaDoTexto(agendamento.data_hora_agendada)}</span>
      <span className="cartao-fim">até {horaDoTexto(agendamento.data_hora_fim_prevista)}</span>
      <span className="cartao-fim">{agendamento.duracao_total_minutos} min</span>
    </span>
  )
}

function DadosDoCartao({ agendamento }) {
  return (
    <span className="cartao-dados">
      <span className="cartao-cliente">{agendamento.cliente.nome}</span>
      <span className="cartao-veiculo">
        {agendamento.veiculo.modelo}
        <span className="placa">{agendamento.veiculo.placa}</span>
      </span>
      <LinhaDeServicos
        servicos={agendamento.servicos}
        complemento={agendamento.vaga.identificacao}
        className="cartao-servico"
      />
    </span>
  )
}

function RodapeDoCartao({ acoes, ocupado, mensagemDeErro, aoMudarStatus }) {
  return (
    <div className="cartao-rodape">
      {mensagemDeErro && (
        <p className="cartao-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}
      {acoes.length > 0 && <BotoesDeStatus acoes={acoes} desabilitado={ocupado} aoEscolher={aoMudarStatus} />}
    </div>
  )
}

export default function CartaoDeAgendamento({ agendamento, selecionado, ocupado, mensagemDeErro, aoAbrir, aoMudarStatus }) {
  const acoes = acoesDoStatus(agendamento.status)

  return (
    <li className="cartao-agendamento">
      <button type="button" className="cartao-corpo" aria-current={selecionado ? 'true' : undefined} onClick={aoAbrir}>
        <HorarioDoCartao agendamento={agendamento} />
        <DadosDoCartao agendamento={agendamento} />
        <PilulaDeStatus status={agendamento.status} />
      </button>
      {(acoes.length > 0 || mensagemDeErro) && (
        <RodapeDoCartao acoes={acoes} ocupado={ocupado} mensagemDeErro={mensagemDeErro} aoMudarStatus={aoMudarStatus} />
      )}
    </li>
  )
}
