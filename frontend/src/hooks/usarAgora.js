import { useEffect, useState } from 'react'

export default function usarAgora(intervaloEmMilissegundos = 30000) {
  const [agora, setAgora] = useState(() => new Date())

  useEffect(() => {
    const temporizador = setInterval(() => setAgora(new Date()), intervaloEmMilissegundos)
    return () => clearInterval(temporizador)
  }, [intervaloEmMilissegundos])

  return agora
}
