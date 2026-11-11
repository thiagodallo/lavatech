import { rotuloDaForma } from '../dominio/formasDePagamento.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import { calcularPercentual, formatarPercentual } from '../formatacao/percentual.js'
import BarraDeProporcao from './BarraDeProporcao.jsx'
import './FaturamentoPorForma.css'

export default function FaturamentoPorForma({ formas, total }) {
  return (
    <ul className="faturamento-por-forma">
      {formas.map((forma) => {
        const percentual = calcularPercentual(forma.faturamento, total)
        return (
          <li key={forma.forma_pagamento}>
            <div className="forma-linha">
              <span>{rotuloDaForma(forma.forma_pagamento)}</span>
              <span className="forma-valores">
                {formatarMoeda(forma.faturamento)}
                <span className="forma-percentual">{formatarPercentual(percentual)}</span>
              </span>
            </div>
            <BarraDeProporcao percentual={percentual} />
          </li>
        )
      })}
    </ul>
  )
}
