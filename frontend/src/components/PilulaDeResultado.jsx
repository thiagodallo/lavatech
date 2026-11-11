import { rotuloDoResultado } from '../dominio/checklistDeQualidade.js'
import './PilulaDeStatus.css'
import './PilulaDeResultado.css'

export default function PilulaDeResultado({ resultado }) {
  return (
    <span className={`pilula pilula-resultado-${resultado.replaceAll('_', '-')}`}>
      {rotuloDoResultado(resultado)}
    </span>
  )
}
