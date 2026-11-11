import './BlocoDoDashboard.css'

function CorpoDoBloco({ rota, vazio, children }) {
  if (rota.mensagemDeErro) {
    return (
      <div className="bloco-estado" role="alert">
        <p>{rota.mensagemDeErro}</p>
        <button type="button" className="botao-secundario" onClick={rota.tentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    )
  }

  if (!rota.dados) {
    return (
      <p className="bloco-estado texto-apoio" role="status">
        Carregando
      </p>
    )
  }

  if (vazio?.(rota.dados)) {
    return <p className="bloco-estado texto-apoio">Sem dados no período</p>
  }

  return children(rota.dados)
}

export default function BlocoDoDashboard({ titulo, rota, vazio, children }) {
  return (
    <section className="bloco-dashboard" aria-busy={rota.carregando}>
      <h3 className="bloco-titulo">{titulo}</h3>
      <CorpoDoBloco rota={rota} vazio={vazio}>
        {children}
      </CorpoDoBloco>
    </section>
  )
}
