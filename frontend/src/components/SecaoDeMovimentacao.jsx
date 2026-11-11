import { useState } from 'react'

import FormularioDeMovimentacao from './FormularioDeMovimentacao.jsx'
import HistoricoDeMovimentacoes from './HistoricoDeMovimentacoes.jsx'
import './SecaoDeMovimentacao.css'

export default function SecaoDeMovimentacao({ produto, aoRegistrar }) {
  const [versaoDoHistorico, setVersaoDoHistorico] = useState(0)

  function registrar(movimentacao) {
    setVersaoDoHistorico((anterior) => anterior + 1)
    aoRegistrar(movimentacao)
  }

  return (
    <div className="secao-de-movimentacao">
      <section aria-labelledby="movimentacao-titulo">
        <h3 className="secao-estoque-titulo" id="movimentacao-titulo">
          Movimentação
        </h3>
        <FormularioDeMovimentacao
          produto={produto}
          aoRegistrar={registrar}
        />
      </section>
      <HistoricoDeMovimentacoes produtoId={produto.id} versao={versaoDoHistorico} />
    </div>
  )
}
