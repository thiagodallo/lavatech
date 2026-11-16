import { useEffect, useRef } from 'react'

import BlocoDePagamento from './BlocoDePagamento.jsx'
import BlocoDeQualidade from './BlocoDeQualidade.jsx'
import DadosDoAgendamento from './DadosDoAgendamento.jsx'
import HistoricoDoAgendamento from './HistoricoDoAgendamento.jsx'
import './DetalhesDoAgendamento.css'

const statusEditaveis = ['agendado', 'aguardando']

export default function DetalhesDoAgendamento({ agendamento, aoEditar }) {
  const raiz = useRef(null)

  useEffect(() => {
    raiz.current.scrollIntoView({ block: 'nearest' })
  }, [agendamento.id])

  return (
    <div className="detalhes" ref={raiz}>
      {statusEditaveis.includes(agendamento.status) && (
        <button type="button" className="botao-secundario botao-pequeno detalhes-editar" onClick={aoEditar}>
          Editar
        </button>
      )}

      <DadosDoAgendamento agendamento={agendamento} />

      <BlocoDePagamento key={`pagamento-${agendamento.id}`} agendamento={agendamento} />

      {agendamento.status === 'concluido' && (
        <BlocoDeQualidade key={`qualidade-${agendamento.id}`} agendamentoId={agendamento.id} />
      )}

      <HistoricoDoAgendamento agendamento={agendamento} />
    </div>
  )
}
