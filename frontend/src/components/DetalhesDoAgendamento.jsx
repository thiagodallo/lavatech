import { useEffect, useRef, useState } from 'react'

import { listarHistoricoDoAgendamento } from '../api/agendamentos.js'
import { dataEHoraDoTexto, horaDoTexto } from '../formatacao/horario.js'
import BlocoDePagamento from './BlocoDePagamento.jsx'
import BlocoDeQualidade from './BlocoDeQualidade.jsx'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './DetalhesDoAgendamento.css'

export default function DetalhesDoAgendamento({ agendamento }) {
  const [historico, setHistorico] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const raiz = useRef(null)

  useEffect(() => {
    raiz.current.scrollIntoView({ block: 'nearest' })
  }, [agendamento.id])

  useEffect(() => {
    let atual = true

    async function carregarHistorico() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrado = await listarHistoricoDoAgendamento(agendamento.id)
        if (atual) setHistorico(encontrado)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarHistorico()
    return () => {
      atual = false
    }
  }, [agendamento.id, agendamento.status, tentativa])

  function corpoDoHistorico() {
    if (mensagemDeErro) {
      return (
        <div className="detalhes-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && historico.length === 0) {
      return (
        <p className="detalhes-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    return (
      <ol className="historico-itens">
        {historico.map((registro) => (
          <li key={`${registro.alterado_em}-${registro.status_novo}`} className="historico-item">
            <PilulaDeStatus status={registro.status_novo} />
            <span className="historico-data">{dataEHoraDoTexto(registro.alterado_em)}</span>
            <span className="historico-autor">{registro.alterado_por?.nome}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="detalhes" ref={raiz}>
      <dl className="detalhes-dados">
        <div className="detalhes-dado">
          <dt>Horário</dt>
          <dd>
            {dataEHoraDoTexto(agendamento.data_hora_agendada)} até{' '}
            {horaDoTexto(agendamento.data_hora_fim_prevista)}
          </dd>
        </div>
        {agendamento.data_hora_inicio && (
          <div className="detalhes-dado">
            <dt>Início</dt>
            <dd>{dataEHoraDoTexto(agendamento.data_hora_inicio)}</dd>
          </div>
        )}
        {agendamento.data_hora_fim && (
          <div className="detalhes-dado">
            <dt>Fim</dt>
            <dd>{dataEHoraDoTexto(agendamento.data_hora_fim)}</dd>
          </div>
        )}
        {agendamento.observacoes && (
          <div className="detalhes-dado">
            <dt>Observações</dt>
            <dd>{agendamento.observacoes}</dd>
          </div>
        )}
      </dl>

      <BlocoDePagamento key={agendamento.id} agendamento={agendamento} />

      {agendamento.status === 'concluido' && (
        <BlocoDeQualidade key={agendamento.id} agendamentoId={agendamento.id} />
      )}

      <section aria-labelledby="historico-titulo">
        <h3 className="detalhes-subtitulo" id="historico-titulo">
          Histórico
        </h3>
        {corpoDoHistorico()}
      </section>
    </div>
  )
}
