import { useEffect, useRef, useState } from 'react'

import './BotoesDeStatus.css'

const ESPERA_DA_CONFIRMACAO_EM_MS = 4000

export default function BotoesDeStatus({ acoes, desabilitado, aoEscolher }) {
  const [statusEmConfirmacao, setStatusEmConfirmacao] = useState(null)
  const recipiente = useRef(null)

  useEffect(() => {
    if (!statusEmConfirmacao) return undefined

    const espera = setTimeout(() => setStatusEmConfirmacao(null), ESPERA_DA_CONFIRMACAO_EM_MS)

    function aoApertarFora(evento) {
      if (!recipiente.current.contains(evento.target)) setStatusEmConfirmacao(null)
    }

    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') setStatusEmConfirmacao(null)
    }

    document.addEventListener('pointerdown', aoApertarFora)
    document.addEventListener('keydown', aoApertarTecla)
    return () => {
      clearTimeout(espera)
      document.removeEventListener('pointerdown', aoApertarFora)
      document.removeEventListener('keydown', aoApertarTecla)
    }
  }, [statusEmConfirmacao])

  function escolherAcao(acao) {
    if (acao.confirmacao && statusEmConfirmacao !== acao.status) {
      setStatusEmConfirmacao(acao.status)
      return
    }
    setStatusEmConfirmacao(null)
    aoEscolher(acao.status)
  }

  function classeDoBotao(acao, posicao) {
    if (statusEmConfirmacao === acao.status) return 'botao-pequeno botao-perigo'
    return posicao === 0 ? 'botao-primario botao-pequeno' : 'botao-secundario botao-pequeno'
  }

  return (
    <div className="botoes-de-status" ref={recipiente}>
      {acoes.map((acao, posicao) => {
        const emConfirmacao = statusEmConfirmacao === acao.status
        return (
          <button
            key={acao.status}
            type="button"
            className={classeDoBotao(acao, posicao)}
            disabled={desabilitado}
            aria-label={emConfirmacao ? acao.confirmacao : undefined}
            onClick={() => escolherAcao(acao)}
          >
            {emConfirmacao ? 'Confirmar' : acao.rotulo}
          </button>
        )
      })}
    </div>
  )
}
