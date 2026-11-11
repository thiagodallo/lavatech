import { formatarPercentual } from '../formatacao/percentual.js'
import './CancelamentosDoPeriodo.css'

export default function CancelamentosDoPeriodo({ cancelamentos }) {
  return (
    <div className="cancelamentos-do-periodo">
      <div className="numero-destaque">
        <span className="numero-medio">{cancelamentos.cancelados}</span>
        <span className="numero-rotulo">
          cancelados ({formatarPercentual(cancelamentos.percentual_cancelados)})
        </span>
      </div>
      <div className="numero-destaque">
        <span className="numero-medio">{cancelamentos.no_shows}</span>
        <span className="numero-rotulo">
          não compareceram ({formatarPercentual(cancelamentos.percentual_no_shows)})
        </span>
      </div>
      <div className="numero-destaque">
        <span className="numero-medio">{cancelamentos.total_agendamentos}</span>
        <span className="numero-rotulo">agendamentos</span>
      </div>
    </div>
  )
}
