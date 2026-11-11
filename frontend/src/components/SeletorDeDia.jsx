import { ChevronLeft, ChevronRight } from 'lucide-react'

import { somarDias } from '../formatacao/horario.js'
import './SeletorDeDia.css'

export default function SeletorDeDia({ data, hoje, aoMudar }) {
  function aoEscolherData(evento) {
    if (evento.target.value) aoMudar(evento.target.value)
  }

  return (
    <div className="seletor-de-dia" role="group" aria-label="Dia da agenda">
      <button
        type="button"
        className="botao-secundario seletor-seta"
        aria-label="Dia anterior"
        onClick={() => aoMudar(somarDias(data, -1))}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="botao-secundario"
        aria-pressed={data === hoje}
        onClick={() => aoMudar(hoje)}
      >
        Hoje
      </button>
      <button
        type="button"
        className="botao-secundario seletor-seta"
        aria-label="Próximo dia"
        onClick={() => aoMudar(somarDias(data, 1))}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
      <input
        type="date"
        className="campo-entrada seletor-data"
        aria-label="Data da agenda"
        value={data}
        onChange={aoEscolherData}
      />
    </div>
  )
}
