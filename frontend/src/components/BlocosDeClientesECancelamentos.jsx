import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import CancelamentosDoPeriodo from './CancelamentosDoPeriodo.jsx'
import ClientesDoPeriodo from './ClientesDoPeriodo.jsx'

const semClientes = (resumo) => resumo.clientes.novos + resumo.clientes.recorrentes === 0
const semAgendamentos = (resumo) => resumo.cancelamentos.total_agendamentos === 0

export default function BlocosDeClientesECancelamentos({ rota }) {
  return (
    <div className="dashboard-dupla">
      <BlocoDoDashboard titulo="Clientes" rota={rota} vazio={semClientes}>
        {(resumo) => <ClientesDoPeriodo clientes={resumo.clientes} />}
      </BlocoDoDashboard>
      <BlocoDoDashboard titulo="Cancelamentos" rota={rota} vazio={semAgendamentos}>
        {(resumo) => <CancelamentosDoPeriodo cancelamentos={resumo.cancelamentos} />}
      </BlocoDoDashboard>
    </div>
  )
}
