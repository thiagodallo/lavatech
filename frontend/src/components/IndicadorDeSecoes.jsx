import './IndicadorDeSecoes.css'

export default function IndicadorDeSecoes({ secoes, atual }) {
  return (
    <nav className="indicador-secoes" aria-label="Seções da apresentação">
      {secoes.map((secao, indice) => (
        <a
          key={secao.id}
          href={`#${secao.id}`}
          className="indicador-ponto"
          aria-label={secao.rotulo}
          aria-current={indice === atual ? 'true' : undefined}
        />
      ))}
    </nav>
  )
}
