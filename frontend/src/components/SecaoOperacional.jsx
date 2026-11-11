import { buscarOperacao, buscarResumoDoDia } from '../api/dashboard.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import HorariosDePico from './HorariosDePico.jsx'
import ResumoDeHoje from './ResumoDeHoje.jsx'
import TempoMedioPorServico from './TempoMedioPorServico.jsx'

const semAgendamentosPorHora = (operacao) => operacao.horarios_de_pico.every((hora) => hora.agendamentos === 0)
const semTemposMedidos = (operacao) => operacao.tempo_medio_por_servico.length === 0

export default function SecaoOperacional({ hoje, periodo }) {
  const rotaDeHoje = usarDadosDaApi(() => buscarResumoDoDia(hoje), hoje)
  const rotaDaOperacao = usarDadosDaApi(() => buscarOperacao(periodo), `${periodo.de}|${periodo.ate}`)

  return (
    <>
      <h2 className="dashboard-secao">Operacional</h2>
      <div className="dashboard-blocos">
        <BlocoDoDashboard titulo="Hoje" rota={rotaDeHoje}>
          {(resumo) => <ResumoDeHoje resumo={resumo} />}
        </BlocoDoDashboard>
        <BlocoDoDashboard titulo="Horários de pico" rota={rotaDaOperacao} vazio={semAgendamentosPorHora}>
          {(operacao) => <HorariosDePico horarios={operacao.horarios_de_pico} />}
        </BlocoDoDashboard>
        <BlocoDoDashboard titulo="Tempo médio de execução" rota={rotaDaOperacao} vazio={semTemposMedidos}>
          {(operacao) => <TempoMedioPorServico servicos={operacao.tempo_medio_por_servico} />}
        </BlocoDoDashboard>
      </div>
    </>
  )
}
