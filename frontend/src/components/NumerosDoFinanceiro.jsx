import { formatarMoeda } from '../formatacao/moeda.js'
import './NumerosDoFinanceiro.css'

export default function NumerosDoFinanceiro({ resumo }) {
  return (
    <div className="numeros-do-financeiro">
      <div className="numero-destaque">
        <span className="numero-grande">{formatarMoeda(resumo.faturamento)}</span>
        <span className="numero-rotulo">faturamento do período</span>
      </div>
      <div className="numero-destaque">
        <span className="numero-medio">{formatarMoeda(resumo.ticket_medio)}</span>
        <span className="numero-rotulo">ticket médio</span>
      </div>
      <div className="numero-destaque">
        <span className="numero-medio">{resumo.pagamentos}</span>
        <span className="numero-rotulo">pagamentos</span>
      </div>
    </div>
  )
}
