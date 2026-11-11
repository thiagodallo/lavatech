import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import FaturamentoPorForma from './FaturamentoPorForma.jsx'
import RankingDeServicos from './RankingDeServicos.jsx'

const semPagamentos = (resumo) => resumo.pagamentos === 0
const semServicosVendidos = (resumo) => resumo.servicos_mais_vendidos.length === 0

export default function BlocosDePagamentoEServicos({ rota }) {
  return (
    <div className="dashboard-dupla">
      <BlocoDoDashboard titulo="Forma de pagamento" rota={rota} vazio={semPagamentos}>
        {(resumo) => <FaturamentoPorForma formas={resumo.faturamento_por_forma} total={resumo.faturamento} />}
      </BlocoDoDashboard>
      <BlocoDoDashboard titulo="Serviços mais vendidos" rota={rota} vazio={semServicosVendidos}>
        {(resumo) => <RankingDeServicos servicos={resumo.servicos_mais_vendidos} />}
      </BlocoDoDashboard>
    </div>
  )
}
