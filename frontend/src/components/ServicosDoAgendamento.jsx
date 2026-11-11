import { formatarMoeda } from '../formatacao/moeda.js'
import TotalDosServicos from './TotalDosServicos.jsx'
import './ServicosDoAgendamento.css'

export default function ServicosDoAgendamento({ agendamento }) {
  return (
    <div className="detalhes-dado">
      <dt>Serviços</dt>
      <dd>
        <ul className="servicos-do-agendamento">
          {agendamento.servicos.map((servico) => (
            <li key={servico.id}>
              <span className="servico-do-agendamento-nome">{servico.nome}</span>
              <span className="servico-do-agendamento-dados">
                {servico.duracao_minutos} min · {formatarMoeda(servico.preco)}
              </span>
            </li>
          ))}
        </ul>
        <TotalDosServicos duracaoMinutos={agendamento.duracao_total_minutos} preco={agendamento.preco_total} />
      </dd>
    </div>
  )
}
