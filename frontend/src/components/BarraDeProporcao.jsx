import './BarraDeProporcao.css'

export default function BarraDeProporcao({ percentual, classe = '' }) {
  return (
    <span className="barra-proporcao" aria-hidden="true">
      <span className={`barra-proporcao-preenchida ${classe}`} style={{ width: `${Math.min(percentual, 100)}%` }} />
    </span>
  )
}
