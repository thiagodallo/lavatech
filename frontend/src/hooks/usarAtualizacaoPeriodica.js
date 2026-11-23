import { useEffect, useRef } from 'react'

export default function usarAtualizacaoPeriodica(atualizar, intervaloEmMilissegundos, ativo) {
  const ultimaFuncao = useRef(atualizar)

  useEffect(() => {
    ultimaFuncao.current = atualizar
  })

  useEffect(() => {
    if (!ativo) return undefined

    function executar() {
      if (document.visibilityState === 'visible') ultimaFuncao.current()
    }

    const temporizador = setInterval(executar, intervaloEmMilissegundos)
    document.addEventListener('visibilitychange', executar)
    return () => {
      clearInterval(temporizador)
      document.removeEventListener('visibilitychange', executar)
    }
  }, [intervaloEmMilissegundos, ativo])
}
