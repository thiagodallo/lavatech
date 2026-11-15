import './FaixaDeVaga.css'

function SituacaoDaVaga({ horaDeLiberacao }) {
  if (!horaDeLiberacao) return <span className="faixa-situacao faixa-livre">Livre</span>
  return <span className="faixa-situacao faixa-ocupada">Ocupada até {horaDeLiberacao}</span>
}

export default function FaixaDeVaga({ vaga, horaDeLiberacao, mostrarSituacao, children }) {
  const vazia = !children || children.length === 0

  return (
    <section className="faixa-de-vaga" aria-label={vaga.identificacao}>
      <header className="faixa-cabecalho">
        <h2 className="faixa-titulo">{vaga.identificacao}</h2>
        {mostrarSituacao && <SituacaoDaVaga horaDeLiberacao={horaDeLiberacao} />}
      </header>
      {vazia ? <p className="faixa-vazia">Sem agendamentos</p> : <ul className="agenda-itens">{children}</ul>}
    </section>
  )
}
