import { acoesDoStatus } from '../dominio/statusDoAgendamento.js'
import { textoDeDuracao } from '../formatacao/duracao.js'
import { horaDoTexto } from '../formatacao/horario.js'
import { minutosDeAtraso, minutosEmAtendimento } from '../formatacao/situacaoNoTempo.js'
import BotoesDeStatus from './BotoesDeStatus.jsx'
import LinhaDeServicos from './LinhaDeServicos.jsx'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './CartaoDeAgendamento.css'

function SituacaoNoTempo({ agendamento, agora }) {
  const atraso = minutosDeAtraso(agendamento, agora)
  if (atraso > 0) return <span className="cartao-situacao cartao-atraso">Atrasado {textoDeDuracao(atraso)}</span>

  const emAtendimento = minutosEmAtendimento(agendamento, agora)
  if (emAtendimento > 0) return <span className="cartao-situacao cartao-duracao">Há {textoDeDuracao(emAtendimento)} em atendimento</span>

  return null
}

function HorarioDoCartao({ agendamento, agora }) {
  const inicio = horaDoTexto(agendamento.data_hora_agendada)
  const fim = horaDoTexto(agendamento.data_hora_fim_prevista)

  return (
    <span className="cartao-horario">
      <span className="cartao-hora">
        {inicio}–{fim}
      </span>
      <span className="cartao-duracao">{textoDeDuracao(agendamento.duracao_total_minutos)}</span>
      {agora && <SituacaoNoTempo agendamento={agendamento} agora={agora} />}
    </span>
  )
}

function DadosDoCartao({ agendamento, mostrarVaga }) {
  return (
    <span className="cartao-dados">
      <span className="cartao-cliente">{agendamento.cliente.nome}</span>
      <span className="cartao-veiculo">
        {agendamento.veiculo.modelo}
        <span className="placa">{agendamento.veiculo.placa}</span>
      </span>
      <LinhaDeServicos
        servicos={agendamento.servicos}
        complemento={mostrarVaga ? agendamento.vaga.identificacao : undefined}
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

export default function CartaoDeAgendamento({
  agendamento,
  agora,
  mostrarVaga = true,
  selecionado,
  ocupado,
  mensagemDeErro,
  aoAbrir,
  aoMudarStatus,
}) {
  const acoes = acoesDoStatus(agendamento.status)

  return (
    <li className="cartao-agendamento">
      <button type="button" className="cartao-corpo" aria-current={selecionado ? 'true' : undefined} onClick={aoAbrir}>
        <HorarioDoCartao agendamento={agendamento} agora={agora} />
        <PilulaDeStatus status={agendamento.status} />
        <DadosDoCartao agendamento={agendamento} mostrarVaga={mostrarVaga} />
      </button>
      {(acoes.length > 0 || mensagemDeErro) && (
        <RodapeDoCartao acoes={acoes} ocupado={ocupado} mensagemDeErro={mensagemDeErro} aoMudarStatus={aoMudarStatus} />
      )}
    </li>
  )
}
