import {
  MINUTO_DE_ABERTURA,
  MINUTO_DE_FECHAMENTO,
  avancoNoMinuto,
  statusNoMinuto,
  textoDoRelogio,
  vagasDeDemonstracao,
} from '../dominio/agendaDeDemonstracao.js'
import usarDiaSimulado from '../hooks/usarDiaSimulado.js'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './AgendaDeDemonstracao.css'

const TOTAL_DE_MINUTOS = MINUTO_DE_FECHAMENTO - MINUTO_DE_ABERTURA
const HORAS_DA_REGUA = Array.from({ length: 11 }, (_, indice) => 8 + indice)

function percentualDoDia(minuto) {
  return ((minuto - MINUTO_DE_ABERTURA) / TOTAL_DE_MINUTOS) * 100
}

function BlocoDeAgendamento({ agendamento, minuto }) {
  const status = statusNoMinuto(agendamento, minuto)

  return (
    <article
      className={`agenda-demo-bloco agenda-demo-bloco-${status.replace('_', '-')}`}
      style={{
        left: `${percentualDoDia(agendamento.inicio)}%`,
        width: `${(agendamento.duracao / TOTAL_DE_MINUTOS) * 100}%`,
        '--avanco': avancoNoMinuto(agendamento, minuto),
      }}
    >
      <span className="agenda-demo-placa">{agendamento.placa}</span>
      <span className="agenda-demo-servico">
        {agendamento.veiculo} | {agendamento.servico}
      </span>
      <PilulaDeStatus status={status} />
    </article>
  )
}

export default function AgendaDeDemonstracao() {
  const minuto = usarDiaSimulado()

  return (
    <figure className="agenda-demo" aria-label="Agenda do dia com duas vagas, em demonstração">
      <header className="agenda-demo-topo">
        <strong>Agenda</strong>
        <span className="agenda-demo-aviso">Dados de demonstração</span>
      </header>

      <div className="agenda-demo-corpo">
        <div className="agenda-demo-rotulos" aria-hidden="true">
          <span />
          {vagasDeDemonstracao.map((vaga) => (
            <span key={vaga.id} className="agenda-demo-rotulo">
              {vaga.nome}
            </span>
          ))}
        </div>

        <div className="agenda-demo-trilhas">
          <div className="agenda-demo-regua" aria-hidden="true">
            {HORAS_DA_REGUA.map((hora) => (
              <span key={hora} style={{ left: `${percentualDoDia(hora * 60)}%` }}>
                {String(hora).padStart(2, '0')}h
              </span>
            ))}
          </div>

          {vagasDeDemonstracao.map((vaga) => (
            <div key={vaga.id} className="agenda-demo-trilha">
              {vaga.agendamentos.map((agendamento) => (
                <BlocoDeAgendamento key={agendamento.id} agendamento={agendamento} minuto={minuto} />
              ))}
            </div>
          ))}

          <div className="agenda-demo-agora" aria-hidden="true" style={{ '--posicao': percentualDoDia(minuto) / 100 }}>
            <span className="agenda-demo-relogio">{textoDoRelogio(minuto)}</span>
          </div>
        </div>
      </div>
    </figure>
  )
}
