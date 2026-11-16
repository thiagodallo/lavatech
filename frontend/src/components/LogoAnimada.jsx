import { ALTURA_DA_LOGO, LARGURA_DA_LOGO, gruposDaLogo, pecasDaLogo } from '../dominio/pecasDaLogo.js'
import './LogoAnimada.css'

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
  return (
    <div
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
