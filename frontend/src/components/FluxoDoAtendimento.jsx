import { etapasDoFluxo } from '../dominio/etapasDoFluxo.js'
import './FluxoDoAtendimento.css'

export default function FluxoDoAtendimento() {
  return (
    <ol className="fluxo">
      {etapasDoFluxo.map((etapa, indice) => (
        <li key={etapa.id} className="fluxo-etapa">
          <span className="fluxo-numero">{String(indice + 1).padStart(2, '0')}</span>
          <h3 className="fluxo-titulo">{etapa.titulo}</h3>
          <p className="fluxo-texto">{etapa.texto}</p>
        </li>
      ))}
    </ol>
  )
}
