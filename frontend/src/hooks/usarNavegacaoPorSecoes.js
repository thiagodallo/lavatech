import { useEffect } from 'react'

const TECLAS_PARA_AVANCAR = ['ArrowDown', 'ArrowRight']
const TECLAS_PARA_VOLTAR = ['ArrowUp', 'ArrowLeft']

function indiceDaSecaoAtual(secoes) {
  const limite = window.innerHeight * 0.4
  let indice = 0
  secoes.forEach((secao, posicao) => {
    if (secao.getBoundingClientRect().top <= limite) indice = posicao
  })
  return indice
}

export default function usarNavegacaoPorSecoes(seletor) {
  useEffect(() => {
    function irParaSecao(evento) {
      const avancar = TECLAS_PARA_AVANCAR.includes(evento.key)
      const voltar = TECLAS_PARA_VOLTAR.includes(evento.key)
      if (!avancar && !voltar) return

      const secoes = [...document.querySelectorAll(seletor)]
      const destino = secoes[indiceDaSecaoAtual(secoes) + (avancar ? 1 : -1)]
      if (!destino) return

      evento.preventDefault()
      const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      destino.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' })
    }

    window.addEventListener('keydown', irParaSecao)
    return () => window.removeEventListener('keydown', irParaSecao)
  }, [seletor])
}
