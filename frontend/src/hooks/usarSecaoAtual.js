import { useEffect, useState } from 'react'

export default function usarSecaoAtual(ids) {
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const secoes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const destino = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null
    destino?.scrollIntoView({ behavior: 'auto', block: 'start' })

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((entrada) => entrada.isIntersecting)
        if (!visivel) return
        setAtual(ids.indexOf(visivel.target.id))
        window.history.replaceState(null, '', `#${visivel.target.id}`)
      },
      { threshold: 0.6 },
    )

    secoes.forEach((secao) => observador.observe(secao))
    return () => observador.disconnect()
  }, [ids])

  return atual
}
