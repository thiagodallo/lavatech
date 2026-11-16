import { useEffect } from 'react'

export default function usarTelaCheia() {
  useEffect(() => {
    function alternar(evento) {
      if (evento.key.toLowerCase() !== 'f' || evento.ctrlKey || evento.metaKey) return
      if (document.fullscreenElement) {
        document.exitFullscreen()
        return
      }
      document.documentElement.requestFullscreen?.()
    }

    window.addEventListener('keydown', alternar)
    return () => window.removeEventListener('keydown', alternar)
  }, [])
}
