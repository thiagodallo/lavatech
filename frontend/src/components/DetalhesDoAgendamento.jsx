import { useEffect, useRef } from 'react'

import BlocoDePagamento from './BlocoDePagamento.jsx'
import BlocoDeQualidade from './BlocoDeQualidade.jsx'
import DadosDoAgendamento from './DadosDoAgendamento.jsx'
import HistoricoDoAgendamento from './HistoricoDoAgendamento.jsx'
import './DetalhesDoAgendamento.css'

export default function DetalhesDoAgendamento({ agendamento }) {
  const raiz = useRef(null)

  useEffect(() => {
    raiz.current.scrollIntoView({ block: 'nearest' })
  }, [agendamento.id])

  return (
    <div className="detalhes" ref={raiz}>
      <DadosDoAgendamento agendamento={agendamento} />

      <BlocoDePagamento key={`pagamento-${agendamento.id}`} agendamento={agendamento} />

      {agendamento.status === 'concluido' && (
        <BlocoDeQualidade key={`qualidade-${agendamento.id}`} agendamentoId={agendamento.id} />
      )}

      <HistoricoDoAgendamento agendamento={agendamento} />
    </div>
  )
}
