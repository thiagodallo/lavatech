import { resultadosDoChecklist } from '../dominio/checklistDeQualidade.js'
import './ResumoDeResultados.css'

export default function ResumoDeResultados({ contagens }) {
  return (
    <dl className="resumo-de-resultados">
      {resultadosDoChecklist.map((resultado) => (
        <div key={resultado.valor} className="resumo-de-resultados-item">
          <dt>{resultado.rotulo}</dt>
          <dd>{contagens[resultado.valor]}</dd>
        </div>
      ))}
    </dl>
  )
}
