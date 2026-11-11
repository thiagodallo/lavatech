import { formatarMoeda } from '../formatacao/moeda.js'
import './RankingDeServicos.css'

export default function RankingDeServicos({ servicos }) {
  return (
    <ol className="ranking-de-servicos">
      {servicos.map((servico) => (
        <li key={servico.servico_id}>
          <span className="ranking-nome">{servico.nome}</span>
          <span className="ranking-quantidade">{servico.quantidade}x</span>
          <span className="ranking-receita">{formatarMoeda(servico.receita)}</span>
        </li>
      ))}
    </ol>
  )
}
