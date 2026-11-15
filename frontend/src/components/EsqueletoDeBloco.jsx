import './Esqueleto.css'

export default function EsqueletoDeBloco({ linhas = 3, rotulo = 'Carregando' }) {
  return (
    <div className="esqueleto-bloco" role="status" aria-label={rotulo}>
      {Array.from({ length: linhas }, (_, indice) => (
        <span key={indice} className="esqueleto" aria-hidden="true" />
      ))}
    </div>
  )
}
