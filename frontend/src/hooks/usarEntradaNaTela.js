import { useEffect, useRef, useState } from 'react'

export default function usarEntradaNaTela() {
  const referencia = useRef(null)
  const [entrou, setEntrou] = useState(false)

  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setEntrou(true)
        observador.disconnect()
      },
      { threshold: 0.25 },
    )

    observador.observe(referencia.current)
    return () => observador.disconnect()
  }, [])

  return [referencia, entrou]
}
