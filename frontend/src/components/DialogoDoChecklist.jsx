import { nomesDosServicos } from '../dominio/servicosDoAgendamento.js'
import DetalhesDoChecklist from './DetalhesDoChecklist.jsx'
import Dialogo from './Dialogo.jsx'
import './DetalhesDoAgendamento.css'

export default function DialogoDoChecklist({ agendamento, aoFechar }) {
  return (
    <Dialogo titulo={agendamento.cliente.nome} aoFechar={aoFechar}>
      <div className="detalhes">
        <dl className="detalhes-dados">
          <div className="detalhes-dado">
            <dt>Serviços</dt>
            <dd>{nomesDosServicos(agendamento.servicos)}</dd>
          </div>
        </dl>
        <DetalhesDoChecklist agendamentoId={agendamento.id} />
      </div>
    </Dialogo>
  )
}
