import { formatarQuantidade } from '../formatacao/quantidade.js'
import BarraDeProporcao from './BarraDeProporcao.jsx'
import './TempoMedioPorServico.css'

function maiorDuracao(servicos) {
  return Math.max(...servicos.flatMap((servico) => [servico.tempo_medio_minutos, servico.duracao_prevista_minutos]))
}

export default function TempoMedioPorServico({ servicos }) {
  const escala = maiorDuracao(servicos)

  return (
    <ul className="tempo-medio-por-servico">
      {servicos.map((servico) => (
        <li key={servico.servico_id}>
          <div className="tempo-cabecalho">
            <span className="tempo-nome">{servico.nome}</span>
            <span className="texto-apoio">{servico.atendimentos} {servico.atendimentos === 1 ? 'atendimento' : 'atendimentos'}</span>
          </div>
          <div className="tempo-linha">
            <span className="tempo-legenda">Previsto</span>
            <BarraDeProporcao percentual={(servico.duracao_prevista_minutos / escala) * 100} classe="tempo-previsto" />
            <span className="tempo-valor">{formatarQuantidade(servico.duracao_prevista_minutos)} min</span>
          </div>
          <div className="tempo-linha">
            <span className="tempo-legenda">Médio</span>
            <BarraDeProporcao percentual={(servico.tempo_medio_minutos / escala) * 100} />
            <span className="tempo-valor">{formatarQuantidade(servico.tempo_medio_minutos)} min</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
