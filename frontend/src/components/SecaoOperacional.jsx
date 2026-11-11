import { buscarResumoDoDia } from '../api/dashboard.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import ResumoDeHoje from './ResumoDeHoje.jsx'

export default function SecaoOperacional({ hoje }) {
  const rotaDeHoje = usarDadosDaApi(() => buscarResumoDoDia(hoje), hoje)

  return (
    <>
      <h2 className="dashboard-secao">Operacional</h2>
      <div className="dashboard-blocos">
        <BlocoDoDashboard titulo="Hoje" rota={rotaDeHoje}>
          {(resumo) => <ResumoDeHoje resumo={resumo} />}
        </BlocoDoDashboard>
      </div>
    </>
  )
}
