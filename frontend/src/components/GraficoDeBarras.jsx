import { useState } from 'react'

import './GraficoDeBarras.css'

function indiceDoMaiorValor(itens) {
  let indiceDoMaior = 0
  itens.forEach((item, indice) => {
    if (item.valor > itens[indiceDoMaior].valor) indiceDoMaior = indice
  })
  return indiceDoMaior
}

function indiceDaTecla(tecla, indiceAtivo, ultimo) {
  const destinos = {
    ArrowLeft: Math.max(indiceAtivo - 1, 0),
    ArrowRight: Math.min(indiceAtivo + 1, ultimo),
    Home: 0,
    End: ultimo,
  }
  return destinos[tecla]
}

function navegarPorTeclado(evento, indiceAtivo, ultimo, aoEscolher) {
  const destino = indiceDaTecla(evento.key, indiceAtivo, ultimo)
  if (destino === undefined) return
  evento.preventDefault()
  aoEscolher(destino)
}

function folgaEntreBarras(quantidade) {
  if (quantidade > 150) return 0
  return quantidade > 60 ? 1 : 2
}

function classeDaBarra(item, ativa) {
  const classes = ['barra']
  if (item.valor === 0) classes.push('barra-zero')
  if (ativa) classes.push('barra-ativa')
  return classes.join(' ')
}

function EixoDoGrafico({ rotulos, quantidade }) {
  return (
    <div className="grafico-eixo" aria-hidden="true">
      {rotulos.map((rotulo) => (
        <span
          key={rotulo.indice}
          className={`eixo-rotulo eixo-${rotulo.alinhamento ?? 'centro'}`}
          style={rotulo.alinhamento ? undefined : { left: `${((rotulo.indice + 0.5) / quantidade) * 100}%` }}
        >
          {rotulo.texto}
        </span>
      ))}
    </div>
  )
}

function TabelaDoGrafico({ itens, formatarValor, colunaDoRotulo, colunaDoValor }) {
  return (
    <details className="grafico-tabela">
      <summary>Ver em tabela</summary>
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr>
              <th scope="col">{colunaDoRotulo}</th>
              <th scope="col">{colunaDoValor}</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id}>
                <td>{item.descricao}</td>
                <td>{formatarValor(item.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

function BarraDoGrafico({ item, maiorValor, ativa, aoEntrar }) {
  const altura = maiorValor > 0 ? `${(item.valor / maiorValor) * 100}%` : undefined

  return (
    <div className="barra-coluna" onMouseEnter={aoEntrar}>
      <div className={classeDaBarra(item, ativa)} style={{ height: altura }} />
    </div>
  )
}

function BarrasDoGrafico({ itens, indiceAtivo, aoEscolher, nomeAcessivel }) {
  const maiorValor = itens[indiceDoMaiorValor(itens)].valor

  return (
    <div
      className="grafico-area"
      role="group"
      tabIndex={0}
      aria-label={nomeAcessivel}
      style={{ gap: `${folgaEntreBarras(itens.length)}px` }}
      onKeyDown={(evento) => navegarPorTeclado(evento, indiceAtivo, itens.length - 1, aoEscolher)}
      onBlur={() => aoEscolher(null)}
      onMouseLeave={() => aoEscolher(null)}
    >
      {itens.map((item, indice) => (
        <BarraDoGrafico
          key={item.id}
          item={item}
          maiorValor={maiorValor}
          ativa={indice === indiceAtivo}
          aoEntrar={() => aoEscolher(indice)}
        />
      ))}
    </div>
  )
}

export default function GraficoDeBarras({ itens, formatarValor, nomeAcessivel, rotulosDoEixo, ...colunas }) {
  const [indiceEscolhido, setIndiceEscolhido] = useState(null)
  const indiceAtivo = itens[indiceEscolhido] ? indiceEscolhido : indiceDoMaiorValor(itens)

  return (
    <div className="grafico-barras">
      <p className="grafico-leitura" aria-live="polite">
        <span>{itens[indiceAtivo].descricao}</span>
        <strong>{formatarValor(itens[indiceAtivo].valor)}</strong>
      </p>
      <BarrasDoGrafico
        itens={itens}
        indiceAtivo={indiceAtivo}
        aoEscolher={setIndiceEscolhido}
        nomeAcessivel={nomeAcessivel}
      />
      <EixoDoGrafico rotulos={rotulosDoEixo} quantidade={itens.length} />
      <TabelaDoGrafico itens={itens} formatarValor={formatarValor} {...colunas} />
    </div>
  )
}
