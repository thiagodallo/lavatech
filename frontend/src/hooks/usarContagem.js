import { useEffect, useState } from 'react'

const DURACAO_EM_MS = 900

function easeOutForte(progresso) {
  return 1 - Math.pow(1 - progresso, 4)
}

export default function usarContagem(alvo, ativa) {
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [valor, setValor] = useState(reduzido ? alvo : 0)

  useEffect(() => {
    if (!ativa || reduzido) return undefined

    let quadro = 0
    const comeco = performance.now()

    function avancar(agora) {
      const progresso = Math.min((agora - comeco) / DURACAO_EM_MS, 1)
      setValor(Math.round(alvo * easeOutForte(progresso)))
      if (progresso < 1) quadro = requestAnimationFrame(avancar)
    }

    quadro = requestAnimationFrame(avancar)
    return () => cancelAnimationFrame(quadro)
  }, [alvo, ativa, reduzido])

  return valor
}
