import { buscarResumoDoPeriodo } from '../api/dashboard.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import NumerosDoFinanceiro from './NumerosDoFinanceiro.jsx'

export default function SecaoFinanceira({ periodo }) {
  const rota = usarDadosDaApi(() => buscarResumoDoPeriodo(periodo), `${periodo.de}|${periodo.ate}`)

  return (
    <>
      <h2 className="dashboard-secao">Financeiro</h2>
      <div className="dashboard-blocos">
        <BlocoDoDashboard titulo="Resumo" rota={rota}>
          {(resumo) => <NumerosDoFinanceiro resumo={resumo} />}
        </BlocoDoDashboard>
      </div>
    </>
  )
}
