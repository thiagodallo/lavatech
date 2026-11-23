import { useEffect, useRef, useState } from 'react'

import './BotoesDeStatus.css'

const ESPERA_DA_CONFIRMACAO_EM_MS = 4000

export default function BotoesDeStatus({ acoes, desabilitado, bloqueadas = [], idDoMotivo, aoEscolher }) {
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
    if (acao.perigosa) return 'botao-pequeno botao-perigo-contorno'
    if (posicao !== 0) return 'botao-secundario botao-pequeno'
    if (acao.status === 'concluido') return 'botao-primario botao-pequeno botao-concluir'
    return 'botao-primario botao-pequeno'
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
            disabled={desabilitado || bloqueadas.includes(acao.status)}
            aria-label={emConfirmacao ? acao.confirmacao : undefined}
            aria-describedby={bloqueadas.includes(acao.status) ? idDoMotivo : undefined}
            onClick={() => escolherAcao(acao)}
          >
            {emConfirmacao ? 'Confirmar' : acao.rotulo}
          </button>
        )
      })}
    </div>
  )
}
