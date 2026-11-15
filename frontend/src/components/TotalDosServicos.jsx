import { formatarMoeda } from '../formatacao/moeda.js'
import { textoDeDuracao } from '../formatacao/duracao.js'
import './TotalDosServicos.css'

export default function TotalDosServicos({ duracaoMinutos, preco }) {
  return (
    <p className="total-dos-servicos">
      <span className="total-dos-servicos-rotulo">Total</span>
      <span>{textoDeDuracao(duracaoMinutos)}</span>
      <span>{formatarMoeda(preco)}</span>
    </p>
  )
}
