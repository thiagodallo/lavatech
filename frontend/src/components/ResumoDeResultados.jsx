import { resultadosDoChecklist } from '../dominio/checklistDeQualidade.js'
import './Esqueleto.css'
import './ResumoDeResultados.css'

export default function ResumoDeResultados({ contagens }) {
  return (
    <dl className="resumo-de-resultados" aria-busy={contagens === null}>
      {resultadosDoChecklist.map((resultado) => (
        <div key={resultado.valor} className="resumo-de-resultados-item">
          <dt>{resultado.rotulo}</dt>
          <dd>{contagens ? contagens[resultado.valor] : <span className="esqueleto resumo-de-resultados-esqueleto" />}</dd>
        </div>
      ))}
    </dl>
  )
}
