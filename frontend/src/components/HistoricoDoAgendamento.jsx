import { listarHistoricoDoAgendamento } from '../api/agendamentos.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import PilulaDeStatus from './PilulaDeStatus.jsx'

function ItemDoHistorico({ registro }) {
  return (
    <li className="historico-item">
      <PilulaDeStatus status={registro.status_novo} />
      <span className="historico-data">{dataEHoraDoTexto(registro.alterado_em)}</span>
      <span className="historico-autor">{registro.alterado_por?.nome}</span>
    </li>
  )
}

function ErroDoHistorico({ rota }) {
  return (
    <div className="detalhes-estado" role="alert">
      <p>{rota.mensagemDeErro}</p>
      <button type="button" className="botao-secundario" onClick={rota.tentarDeNovo}>
        Tentar de novo
      </button>
    </div>
  )
}

function CorpoDoHistorico({ rota }) {
  const historico = rota.dados ?? []

  if (rota.mensagemDeErro) return <ErroDoHistorico rota={rota} />

  if (rota.carregando && historico.length === 0) {
    return (
      <p className="detalhes-estado texto-apoio" role="status">
        Carregando
      </p>
    )
  }

  return (
    <ol className="historico-itens">
      {historico.map((registro) => (
        <ItemDoHistorico key={`${registro.alterado_em}-${registro.status_novo}`} registro={registro} />
      ))}
    </ol>
  )
}

export default function HistoricoDoAgendamento({ agendamento }) {
  const rota = usarDadosDaApi(
    () => listarHistoricoDoAgendamento(agendamento.id),
    `${agendamento.id}|${agendamento.status}`,
  )

  return (
    <section aria-labelledby="historico-titulo">
      <h3 className="detalhes-subtitulo" id="historico-titulo">
        Histórico
      </h3>
      <CorpoDoHistorico rota={rota} />
    </section>
  )
}
