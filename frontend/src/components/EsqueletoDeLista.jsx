import './Esqueleto.css'

export default function EsqueletoDeLista({ linhas = 6, rotulo = 'Carregando' }) {
  return (
    <div className="esqueleto-lista" role="status" aria-label={rotulo}>
      {Array.from({ length: linhas }, (_, indice) => (
        <div key={indice} className="esqueleto-lista-linha" aria-hidden="true">
          <div className="esqueleto-lista-textos">
            <span className="esqueleto esqueleto-titulo" />
            <span className="esqueleto esqueleto-subtitulo" />
          </div>
          <span className="esqueleto esqueleto-valor" />
        </div>
      ))}
    </div>
  )
}
