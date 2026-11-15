import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

import './Dialogo.css'

export default function Dialogo({ titulo, aoFechar, children }) {
  const dialogo = useRef(null)
  const origem = useRef(document.activeElement)
  const idDoTitulo = useId()

  useEffect(() => {
    const elemento = dialogo.current
    const elementoDeOrigem = origem.current
    if (!elemento.open) elemento.showModal()
    return () => {
      if (elementoDeOrigem?.isConnected) elementoDeOrigem.focus()
    }
  }, [])

  function fecharAoClicarFora(evento) {
    if (evento.target === dialogo.current) dialogo.current.close()
  }

  return (
    <dialog
      ref={dialogo}
      className="dialogo"
      aria-labelledby={idDoTitulo}
      onClose={aoFechar}
      onClick={fecharAoClicarFora}
    >
      <div className="dialogo-conteudo">
        <header className="dialogo-cabecalho">
          <h2 className="dialogo-titulo" id={idDoTitulo}>
            {titulo}
          </h2>
          <button type="button" className="dialogo-fechar" aria-label="Fechar" onClick={() => dialogo.current.close()}>
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
