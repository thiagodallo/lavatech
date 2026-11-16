import { useLayoutEffect, useRef } from 'react'

import { ALTURA_DA_LOGO, LARGURA_DA_LOGO, gruposDaLogo, pecasDaLogo } from '../dominio/pecasDaLogo.js'
import './LogoAnimada.css'

const ORIGEM_DO_SIMBOLO_X = 129.5 / LARGURA_DA_LOGO
const ORIGEM_DO_SIMBOLO_Y = 0.5
const ALTURA_DO_SIMBOLO = 1

function percentual(valor, total) {
  return `${(valor / total) * 100}%`
}

function PecaDaLogo({ peca }) {
  return (
    <span
      className="logo-recorte"
      style={{
        left: percentual(peca.x, LARGURA_DA_LOGO),
        top: percentual(peca.y, ALTURA_DA_LOGO),
        width: percentual(peca.largura, LARGURA_DA_LOGO),
        height: percentual(peca.altura, ALTURA_DA_LOGO),
      }}
    >
      <span
        className={`logo-peca logo-peca-${peca.nome} logo-cor-${peca.cor}`}
        style={{ '--mascara': `url(${peca.arquivo})` }}
      />
    </span>
  )
}

export default function LogoAnimada({ className = '' }) {
  const raiz = useRef(null)

  useLayoutEffect(() => {
    const elemento = raiz.current
    const caixa = elemento.getBoundingClientRect()
    const origemX = caixa.left + caixa.width * ORIGEM_DO_SIMBOLO_X
    const origemY = caixa.top + caixa.height * ORIGEM_DO_SIMBOLO_Y
    const alturaDoSimbolo = caixa.height * ALTURA_DO_SIMBOLO
    elemento.style.setProperty('--dx', `${document.documentElement.clientWidth / 2 - origemX}px`)
    elemento.style.setProperty('--dy', `${window.innerHeight / 2 - origemY}px`)
    elemento.style.setProperty('--escala', String((window.innerHeight * 0.22) / alturaDoSimbolo))
  }, [])

  return (
    <div
      ref={raiz}
      className={`logo-anim ${className}`.trim()}
      role="img"
      aria-label="LavaTech"
      style={{ aspectRatio: `${LARGURA_DA_LOGO} / ${ALTURA_DA_LOGO}` }}
    >
      {gruposDaLogo.map((grupo) => (
        <div key={grupo} className={`logo-grupo logo-grupo-${grupo}`} aria-hidden="true">
          {pecasDaLogo
            .filter((peca) => peca.grupo === grupo)
            .map((peca) => (
              <PecaDaLogo key={peca.nome} peca={peca} />
            ))}
        </div>
      ))}
    </div>
  )
}
