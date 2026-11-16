import { useEffect, useState } from 'react'

import { MINUTO_DE_ABERTURA, MINUTO_FINAL_DA_SIMULACAO } from '../dominio/agendaDeDemonstracao.js'

const ATRASO_INICIAL_EM_MS = 900
const DURACAO_EM_MS = 9000

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function usarDiaSimulado() {
  const [minuto, setMinuto] = useState(() =>
    prefereMovimentoReduzido() ? MINUTO_FINAL_DA_SIMULACAO : MINUTO_DE_ABERTURA,
  )

  useEffect(() => {
    if (prefereMovimentoReduzido()) return undefined

    let quadro = 0
    const comeco = performance.now() + ATRASO_INICIAL_EM_MS

    function avancar(agora) {
      const progresso = Math.min(Math.max((agora - comeco) / DURACAO_EM_MS, 0), 1)
      const percorrido = (MINUTO_FINAL_DA_SIMULACAO - MINUTO_DE_ABERTURA) * progresso
      setMinuto(MINUTO_DE_ABERTURA + Math.floor(percorrido))
      if (progresso < 1) quadro = requestAnimationFrame(avancar)
    }

    quadro = requestAnimationFrame(avancar)
    return () => cancelAnimationFrame(quadro)
  }, [])

  return minuto
}
