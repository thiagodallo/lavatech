import HistoricoDeMovimentacoes from './HistoricoDeMovimentacoes.jsx'

export default function SecaoDeMovimentacao({ produto }) {
  return <HistoricoDeMovimentacoes produtoId={produto.id} versao={0} />
}
