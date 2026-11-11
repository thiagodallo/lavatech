import { buscarResumoDoPeriodo } from '../api/dashboard.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import BlocosDeClientesECancelamentos from './BlocosDeClientesECancelamentos.jsx'
import BlocosDePagamentoEServicos from './BlocosDePagamentoEServicos.jsx'
import FaturamentoPorDia from './FaturamentoPorDia.jsx'
import NumerosDoFinanceiro from './NumerosDoFinanceiro.jsx'

const semPagamentos = (resumo) => resumo.pagamentos === 0

export default function SecaoFinanceira({ periodo }) {
  const rota = usarDadosDaApi(() => buscarResumoDoPeriodo(periodo), `${periodo.de}|${periodo.ate}`)

  return (
    <>
      <h2 className="dashboard-secao">Financeiro</h2>
      <div className="dashboard-blocos">
        <BlocoDoDashboard titulo="Resumo" rota={rota}>
          {(resumo) => <NumerosDoFinanceiro resumo={resumo} />}
        </BlocoDoDashboard>
        <BlocoDoDashboard titulo="Faturamento por dia" rota={rota} vazio={semPagamentos}>
          {(resumo) => <FaturamentoPorDia dias={resumo.faturamento_por_dia} />}
        </BlocoDoDashboard>
        <BlocosDePagamentoEServicos rota={rota} />
        <BlocosDeClientesECancelamentos rota={rota} />
      </div>
    </>
  )
}
