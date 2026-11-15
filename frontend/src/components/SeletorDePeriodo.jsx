import { primeiroDiaDoMes, somarDias } from '../formatacao/horario.js'
import CampoDeData from './CampoDeData.jsx'
import './SeletorDePeriodo.css'

function atalhosDePeriodo(hoje) {
  return [
    { rotulo: '7 dias', de: somarDias(hoje, -6) },
    { rotulo: '30 dias', de: somarDias(hoje, -29) },
    { rotulo: 'Este mês', de: primeiroDiaDoMes(hoje) },
  ]
}

function CampoDoPeriodo({ rotulo, valor, aoEscolher }) {
  return (
    <div className="periodo-campo">
      <span className="campo-rotulo">{rotulo}</span>
      <CampoDeData classe="periodo-data" rotulo={rotulo} valor={valor} aoEscolher={aoEscolher} />
    </div>
  )
}

export default function SeletorDePeriodo({ periodo, hoje, aoMudar }) {
  return (
    <div className="seletor-de-periodo" role="group" aria-label="Período">
      <div className="periodo-atalhos">
        {atalhosDePeriodo(hoje).map((atalho) => (
          <button
            key={atalho.rotulo}
            type="button"
            className="botao-secundario"
            aria-pressed={periodo.de === atalho.de && periodo.ate === hoje}
            onClick={() => aoMudar({ de: atalho.de, ate: hoje })}
          >
            {atalho.rotulo}
          </button>
        ))}
      </div>
      <CampoDoPeriodo rotulo="De" valor={periodo.de} aoEscolher={(de) => aoMudar({ ...periodo, de })} />
      <CampoDoPeriodo rotulo="Até" valor={periodo.ate} aoEscolher={(ate) => aoMudar({ ...periodo, ate })} />
    </div>
  )
}
