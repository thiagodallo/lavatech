import { useEffect, useState } from 'react'

import { MINUTO_DE_ABERTURA, MINUTO_FINAL_DA_SIMULACAO } from '../dominio/agendaDeDemonstracao.js'

const ATRASO_DA_PRIMEIRA_RODADA_EM_MS = 1200
const ATRASO_DO_REINICIO_EM_MS = 400
const DURACAO_EM_MS = 9000

function prefereMovimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function estaDigitando(evento) {
  return evento.target.closest('input, textarea, select, [contenteditable]') !== null
}

export default function usarDiaSimulado() {
  const [rodada, setRodada] = useState(0)
  const [minuto, setMinuto] = useState(() =>
    prefereMovimentoReduzido() ? MINUTO_FINAL_DA_SIMULACAO : MINUTO_DE_ABERTURA,
  )

  useEffect(() => {
    function reiniciar(evento) {
      if (evento.key.toLowerCase() !== 'r' || evento.ctrlKey || evento.metaKey || estaDigitando(evento)) return
      setRodada((anterior) => anterior + 1)
    }

    window.addEventListener('keydown', reiniciar)
    return () => window.removeEventListener('keydown', reiniciar)
  }, [])

  useEffect(() => {
    if (prefereMovimentoReduzido()) return undefined

    let quadro = 0
    const atraso = rodada === 0 ? ATRASO_DA_PRIMEIRA_RODADA_EM_MS : ATRASO_DO_REINICIO_EM_MS
    const comeco = performance.now() + atraso
    setMinuto(MINUTO_DE_ABERTURA)

    function avancar(agora) {
      const progresso = Math.min(Math.max((agora - comeco) / DURACAO_EM_MS, 0), 1)
      const percorrido = (MINUTO_FINAL_DA_SIMULACAO - MINUTO_DE_ABERTURA) * progresso
      setMinuto(MINUTO_DE_ABERTURA + Math.floor(percorrido))
      if (progresso < 1) quadro = requestAnimationFrame(avancar)
    }

    quadro = requestAnimationFrame(avancar)
    return () => cancelAnimationFrame(quadro)
  }, [rodada])

  return minuto
}
