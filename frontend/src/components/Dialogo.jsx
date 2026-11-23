import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'

import './Dialogo.css'

const JANELA_PEQUENA = '(max-width: 760px)'
const MOVIMENTO_REDUZIDO = '(prefers-reduced-motion: reduce)'
const DISTANCIA_PARA_FECHAR_EM_PX = 100
const VELOCIDADE_PARA_FECHAR_EM_PX_POR_MS = 0.6
const MENOR_ARRASTE_DE_UM_GESTO_RAPIDO_EM_PX = 30
const DURACAO_DO_ARRASTE_EM_MS = 200

export default function Dialogo({ titulo, aoFechar, children }) {
  const dialogo = useRef(null)
  const origem = useRef(document.activeElement)
  const idDoTitulo = useId()
  const arraste = useRef(null)

  useEffect(() => {
    const elemento = dialogo.current
    const elementoDeOrigem = origem.current
    if (!elemento.open) elemento.showModal()
    return () => {
      if (elementoDeOrigem?.isConnected) elementoDeOrigem.focus()
    }
  }, [])

  function iniciarArraste(evento) {
    if (evento.target.closest('button') || !window.matchMedia(JANELA_PEQUENA).matches) return
    arraste.current = { inicioY: evento.clientY, inicioEm: performance.now(), deslocamento: 0 }
    evento.currentTarget.setPointerCapture(evento.pointerId)
    dialogo.current.style.transition = 'none'
  }

  function arrastar(evento) {
    if (!arraste.current) return
    const deslocamento = Math.max(0, evento.clientY - arraste.current.inicioY)
    arraste.current.deslocamento = deslocamento
    dialogo.current.style.transform = `translateY(${deslocamento}px)`
  }

  function soltar() {
    const atual = arraste.current
    if (!atual) return
    arraste.current = null
    const elemento = dialogo.current
    const velocidade = atual.deslocamento / (performance.now() - atual.inicioEm)
    const foiGestoRapido =
      atual.deslocamento > MENOR_ARRASTE_DE_UM_GESTO_RAPIDO_EM_PX && velocidade > VELOCIDADE_PARA_FECHAR_EM_PX_POR_MS
    const deveFechar = atual.deslocamento > DISTANCIA_PARA_FECHAR_EM_PX || foiGestoRapido
    const semAnimacao = window.matchMedia(MOVIMENTO_REDUZIDO).matches
    if (deveFechar && semAnimacao) {
      elemento.close()
      return
    }
    elemento.style.transition = semAnimacao ? 'none' : `transform ${DURACAO_DO_ARRASTE_EM_MS}ms var(--curva-suave)`
    elemento.style.transform = deveFechar ? 'translateY(100%)' : ''
    if (deveFechar) setTimeout(() => elemento.close(), DURACAO_DO_ARRASTE_EM_MS)
  }

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
        <header
          className="dialogo-cabecalho"
          onPointerDown={iniciarArraste}
          onPointerMove={arrastar}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          onLostPointerCapture={soltar}
        >
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
