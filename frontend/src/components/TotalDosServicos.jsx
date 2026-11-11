import { formatarMoeda } from '../formatacao/moeda.js'
import './TotalDosServicos.css'

export default function TotalDosServicos({ duracaoMinutos, preco }) {
  return (
    <p className="total-dos-servicos">
      <span className="total-dos-servicos-rotulo">Total</span>
      <span>{duracaoMinutos} min</span>
      <span>{formatarMoeda(preco)}</span>
    </p>
  )
}
