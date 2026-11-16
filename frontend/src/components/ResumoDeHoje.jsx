import { rotulosDeStatus } from '../dominio/statusDoAgendamento.js'
import { horaDoTexto } from '../formatacao/horario.js'
import LinhaDeServicos from './LinhaDeServicos.jsx'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './ResumoDeHoje.css'

function ProximoAtendimento({ atendimento }) {
  if (!atendimento) return <p className="texto-apoio">Nenhum atendimento pela frente</p>

  return (
    <p className="proximo-atendimento">
      <span className="proximo-hora">{horaDoTexto(atendimento.data_hora_agendada)}</span>
      <span>{atendimento.cliente.nome}</span>
      <LinhaDeServicos
        servicos={atendimento.servicos}
        complemento={atendimento.vaga.identificacao}
        separador="/"
        className="texto-apoio"
      />
    </p>
  )
}

const statusDoResumo = Object.keys(rotulosDeStatus)

function ContagemPorStatus({ porStatus }) {
  return (
    <ul className="resumo-status" aria-label="Agendamentos de hoje por status">
      {statusDoResumo.map((status) => (
        <li key={status}>
          <span className="status-contagem">{porStatus[status] ?? 0}</span>
          <PilulaDeStatus status={status} />
        </li>
      ))}
    </ul>
  )
}

export default function ResumoDeHoje({ resumo }) {
  const ocupacao = resumo.ocupacao_vagas

  return (
    <div className="resumo-de-hoje">
      <div className="resumo-total">
        <span className="numero-grande">{resumo.total}</span>
        <span className="numero-rotulo">agendamentos hoje</span>
      </div>
      <ContagemPorStatus porStatus={resumo.por_status} />
      <div className="resumo-vagas">
        <span className="numero-medio">
          {ocupacao.em_uso}/{ocupacao.total}
        </span>
        <span className="numero-rotulo">vagas em uso</span>
      </div>
      <div className="resumo-proximo">
        <h4 className="resumo-subtitulo">Próximo atendimento</h4>
        <ProximoAtendimento atendimento={resumo.proximo_atendimento} />
      </div>
    </div>
  )
}
