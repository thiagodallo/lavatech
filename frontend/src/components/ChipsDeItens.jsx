import { rotuloCurtoDoItem } from '../dominio/checklistDeQualidade.js'
import './ChipsDeItens.css'

export default function ChipsDeItens({ campos }) {
  if (campos.length === 0) return null

  return (
    <ul className="chips-de-itens" aria-label="Itens não conformes">
      {campos.map((campo) => (
        <li key={campo} className="chip-de-item">
          {rotuloCurtoDoItem(campo)}
        </li>
      ))}
    </ul>
  )
}
