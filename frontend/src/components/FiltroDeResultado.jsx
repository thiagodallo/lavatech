import { resultadosDoChecklist } from '../dominio/checklistDeQualidade.js'
import CampoDeSelecao from './CampoDeSelecao.jsx'
import './FiltroDeResultado.css'

export default function FiltroDeResultado({ valor, aoMudar }) {
  return (
    <CampoDeSelecao
      id="filtro-resultado"
      rotulo="Resultado"
      className="campo-entrada filtro-de-resultado"
      value={valor}
      onChange={(evento) => aoMudar(evento.target.value)}
    >
      <option value="">Todos</option>
      {resultadosDoChecklist.map((resultado) => (
        <option key={resultado.valor} value={resultado.valor}>
          {resultado.rotulo}
        </option>
      ))}
    </CampoDeSelecao>
  )
}
