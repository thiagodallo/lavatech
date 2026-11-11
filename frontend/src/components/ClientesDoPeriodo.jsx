import { calcularPercentual, formatarPercentual } from '../formatacao/percentual.js'
import './ClientesDoPeriodo.css'

export default function ClientesDoPeriodo({ clientes }) {
  const total = clientes.novos + clientes.recorrentes
  const percentualDeNovos = calcularPercentual(clientes.novos, total)

  return (
    <div className="clientes-do-periodo">
      <div className="clientes-numeros">
        <div className="numero-destaque">
          <span className="numero-medio">{clientes.novos}</span>
          <span className="numero-rotulo">novos ({formatarPercentual(percentualDeNovos)})</span>
        </div>
        <div className="numero-destaque">
          <span className="numero-medio">{clientes.recorrentes}</span>
          <span className="numero-rotulo">
            recorrentes ({formatarPercentual(100 - percentualDeNovos)})
          </span>
        </div>
      </div>
      <div className="clientes-proporcao" aria-hidden="true">
        <span className="clientes-novos" style={{ width: `${percentualDeNovos}%` }} />
        <span className="clientes-recorrentes" style={{ width: `${100 - percentualDeNovos}%` }} />
      </div>
    </div>
  )
}
