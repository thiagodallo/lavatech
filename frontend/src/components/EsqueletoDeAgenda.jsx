import './EsqueletoDeAgenda.css'

const cartoes = [0, 1]

export default function EsqueletoDeAgenda() {
  return (
    <div className="esqueleto-agenda" role="status" aria-label="Carregando a agenda">
      {cartoes.map((cartao) => (
        <div key={cartao} className="esqueleto-cartao">
          <span className="esqueleto-linha esqueleto-horario" />
          <span className="esqueleto-linha esqueleto-nome" />
          <span className="esqueleto-linha esqueleto-detalhe" />
        </div>
      ))}
    </div>
  )
}
