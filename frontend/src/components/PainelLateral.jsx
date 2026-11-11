import { X } from 'lucide-react'

import './PainelLateral.css'

export default function PainelLateral({ titulo, aoFechar, children }) {
  return (
    <aside className="painel" aria-label={titulo}>
      <header className="painel-cabecalho">
        <h2 className="painel-titulo">{titulo}</h2>
        <button type="button" className="painel-fechar" aria-label="Fechar" onClick={aoFechar}>
          <X size={16} aria-hidden="true" />
        </button>
      </header>
      {children}
    </aside>
  )
}
