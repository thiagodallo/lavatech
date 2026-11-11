import { Link } from 'react-router'

import { rotulosDeStatus } from '../dominio/statusDoAgendamento.js'
import { horaDoTexto } from '../formatacao/horario.js'
import { formatarQuantidade } from '../formatacao/quantidade.js'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './ResumoDeHoje.css'

function ProximoAtendimento({ atendimento }) {
  if (!atendimento) return <p className="texto-apoio">Nenhum atendimento pela frente</p>

  return (
    <p className="proximo-atendimento">
      <span className="proximo-hora">{horaDoTexto(atendimento.data_hora_agendada)}</span>
      <span>{atendimento.cliente.nome}</span>
      <span className="texto-apoio">
        {atendimento.servico.nome} / {atendimento.vaga.identificacao}
      </span>
    </p>
  )
}

function EstoqueAbaixoDoMinimo({ itens }) {
  if (itens.length === 0) return <p className="texto-apoio">Estoque em dia</p>

  return (
    <>
      <ul className="estoque-baixo">
        {itens.slice(0, 4).map((item) => (
          <li key={item.id}>
            <span>{item.nome}</span>
            <span className="estoque-baixo-saldo">
              {formatarQuantidade(item.quantidade_atual)} / {formatarQuantidade(item.quantidade_minima)}
            </span>
          </li>
        ))}
      </ul>
      <Link to="/estoque" className="link-estoque">
        {itens.length > 4 ? `Ver os ${itens.length} no estoque` : 'Ver no estoque'}
      </Link>
    </>
  )
}

function ContagemPorStatus({ porStatus }) {
  return (
    <ul className="resumo-status" aria-label="Agendamentos de hoje por status">
      {Object.keys(rotulosDeStatus).map((status) => (
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
      <div className="resumo-estoque">
        <h4 className="resumo-subtitulo">Estoque abaixo do mínimo</h4>
        <EstoqueAbaixoDoMinimo itens={resumo.estoque_abaixo_do_minimo} />
      </div>
    </div>
  )
}
