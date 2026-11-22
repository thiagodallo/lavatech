import { ChevronLeft, ChevronRight } from 'lucide-react'

import { somarDias } from '../formatacao/horario.js'
import CampoDeData from './CampoDeData.jsx'
import './SeletorDeDia.css'

export default function SeletorDeDia({ data, aoMudar }) {
  return (
    <div className="seletor-de-dia" role="group" aria-label="Dia da agenda">
      <button
        type="button"
        className="botao-secundario seletor-seta"
        aria-label="Dia anterior"
        onClick={() => aoMudar(somarDias(data, -1))}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <CampoDeData classe="seletor-data" rotulo="Data da agenda" valor={data} aoEscolher={aoMudar} />
      <button
        type="button"
        className="botao-secundario seletor-seta"
        aria-label="Próximo dia"
        onClick={() => aoMudar(somarDias(data, 1))}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  )
}
