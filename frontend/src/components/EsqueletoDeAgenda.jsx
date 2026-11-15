import './Esqueleto.css'
import './EsqueletoDeAgenda.css'

const cartoes = [0, 1]

export default function EsqueletoDeAgenda() {
  return (
    <div className="esqueleto-agenda" role="status" aria-label="Carregando a agenda">
      {cartoes.map((cartao) => (
        <div key={cartao} className="esqueleto-cartao">
          <span className="esqueleto esqueleto-hora-do-cartao" />
          <span className="esqueleto esqueleto-nome-do-cartao" />
          <span className="esqueleto esqueleto-detalhe-do-cartao" />
        </div>
      ))}
    </div>
  )
}
