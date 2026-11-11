import { useEffect, useState } from 'react'

import { listarMovimentacoesDoProduto } from '../api/movimentacoes.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import { formatarQuantidade } from '../formatacao/quantidade.js'
import './HistoricoDeMovimentacoes.css'

const tiposDaMovimentacao = {
  entrada: { rotulo: 'Entrada', sinal: '+' },
  saida: { rotulo: 'Saída', sinal: '-' },
}

export default function HistoricoDeMovimentacoes({ produtoId, versao }) {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarMovimentacoes() {
      setMensagemDeErro('')
      try {
        const encontradas = await listarMovimentacoesDoProduto(produtoId)
        if (atual) setMovimentacoes(encontradas)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarMovimentacoes()
    return () => {
      atual = false
    }
  }, [produtoId, versao, tentativa])

  function tentarDeNovo() {
    setCarregando(true)
    setTentativa((anterior) => anterior + 1)
  }

  function corpoDoHistorico() {
    if (mensagemDeErro) {
      return (
        <div className="historico-estoque-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={tentarDeNovo}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando) {
      return (
        <p className="historico-estoque-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (movimentacoes.length === 0) {
      return <p className="historico-estoque-estado texto-apoio">Sem movimentações</p>
    }

    return (
      <ol className="historico-estoque-itens">
        {movimentacoes.map((movimentacao) => {
          const tipo = tiposDaMovimentacao[movimentacao.tipo]
          return (
            <li key={movimentacao.id} className="historico-estoque-item">
              <span className="historico-estoque-data">{dataEHoraDoTexto(movimentacao.data)}</span>
              <span className={`historico-estoque-tipo historico-estoque-${movimentacao.tipo}`}>
                {tipo.rotulo}
              </span>
              <span className="historico-estoque-quantidade">
                {tipo.sinal}
                {formatarQuantidade(movimentacao.quantidade)}
                {movimentacao.produto.unidade_medida && ` ${movimentacao.produto.unidade_medida}`}
              </span>
              <span className="historico-estoque-autor">{movimentacao.funcionario?.nome}</span>
              {movimentacao.observacao && (
                <span className="historico-estoque-observacao">{movimentacao.observacao}</span>
              )}
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <section aria-labelledby="historico-estoque-titulo">
      <h3 className="secao-estoque-titulo" id="historico-estoque-titulo">
        Histórico
      </h3>
      {corpoDoHistorico()}
    </section>
  )
}
