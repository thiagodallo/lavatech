import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import {
  dataPorExtensoCompleta,
  diaDaSemana,
  dividirEmSemanas,
  gradeDoMes,
  montarData,
  nomesDosMeses,
  separarData,
  somarDias,
} from '../dominio/datasDoCalendario.js'
import './Calendario.css'

const INICIAIS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const MOVIMENTOS_DO_TECLADO = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

function BotaoDeMes({ direcao, aoClicar }) {
  const Icone = direcao === 'anterior' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      className="calendario-mes-botao"
      aria-label={direcao === 'anterior' ? 'Mês anterior' : 'Próximo mês'}
      onClick={aoClicar}
    >
      <Icone size={16} aria-hidden="true" />
    </button>
  )
}

function DiaDoMes({ data, escolhido, ehHoje, alvoDoTab, aoEscolher }) {
  const classes = ['calendario-dia', escolhido && 'calendario-dia-escolhido', ehHoje && 'calendario-dia-hoje']
  return (
    <div role="gridcell" aria-selected={escolhido} className="calendario-celula">
      <button
        type="button"
        data-dia={data}
        tabIndex={alvoDoTab ? 0 : -1}
        aria-current={ehHoje ? 'date' : undefined}
        aria-label={`${dataPorExtensoCompleta(data)}${ehHoje ? ', hoje' : ''}`}
        className={classes.filter(Boolean).join(' ')}
        onClick={() => aoEscolher(data)}
      >
        {separarData(data).dia}
      </button>
    </div>
  )
}

export default function Calendario({ valor, hoje, aoEscolher }) {
  const raiz = useRef(null)
  const focoPendente = useRef(false)
  const [foco, setFoco] = useState(valor ?? hoje)
  const [visivel, setVisivel] = useState(() => {
    const { ano, mes } = separarData(valor ?? hoje)
    return { ano, mes }
  })

  const primeiroDoMes = montarData(visivel.ano, visivel.mes, 1)
  const focoNoMesVisivel = foco.slice(0, 7) === primeiroDoMes.slice(0, 7)
  const alvoDoTab = focoNoMesVisivel ? foco : primeiroDoMes
  const nomeDoMes = nomesDosMeses[visivel.mes - 1]

  useEffect(() => {
    const temporizador = setTimeout(() => {
      raiz.current?.querySelector('[data-dia][tabindex="0"]')?.focus({ preventScroll: true })
    }, 0)
    return () => clearTimeout(temporizador)
  }, [])

  useEffect(() => {
    if (!focoPendente.current) return
    focoPendente.current = false
    raiz.current?.querySelector(`[data-dia="${foco}"]`)?.focus({ preventScroll: true })
  }, [foco, visivel])

  function irParaMes(deslocamento) {
    const referencia = new Date(Date.UTC(visivel.ano, visivel.mes - 1 + deslocamento, 1))
    setVisivel({ ano: referencia.getUTCFullYear(), mes: referencia.getUTCMonth() + 1 })
  }

  function moverFoco(destino) {
    const { ano, mes } = separarData(destino)
    focoPendente.current = true
    setFoco(destino)
    setVisivel({ ano, mes })
  }

  function aoTeclar(evento) {
    const atual = evento.target.closest('[data-dia]')?.dataset.dia
    if (!atual || evento.altKey || evento.ctrlKey || evento.metaKey) return
    const deslocamento = MOVIMENTOS_DO_TECLADO[evento.key]
    if (deslocamento) {
      evento.preventDefault()
      moverFoco(somarDias(atual, deslocamento))
      return
    }
    if (evento.key === 'Home') {
      evento.preventDefault()
      moverFoco(somarDias(atual, -diaDaSemana(atual)))
      return
    }
    if (evento.key === 'End') {
      evento.preventDefault()
      moverFoco(somarDias(atual, 6 - diaDaSemana(atual)))
    }
  }

  return (
    <div ref={raiz} className="calendario" onKeyDown={aoTeclar}>
      <div className="calendario-cabecalho">
        <b className="calendario-titulo" aria-live="polite">
          {nomeDoMes[0].toUpperCase()}
          {nomeDoMes.slice(1)} de {visivel.ano}
        </b>
        <div className="calendario-mes-botoes">
          <BotaoDeMes direcao="anterior" aoClicar={() => irParaMes(-1)} />
          <BotaoDeMes direcao="proximo" aoClicar={() => irParaMes(1)} />
        </div>
      </div>
      <div role="grid" aria-label={`${nomeDoMes} de ${visivel.ano}`}>
        <div role="row" className="calendario-semana">
          {INICIAIS_DA_SEMANA.map((inicial, indice) => (
            <span key={indice} role="columnheader" className="calendario-dia-da-semana">
              {inicial}
            </span>
          ))}
        </div>
        {dividirEmSemanas(gradeDoMes(visivel.ano, visivel.mes)).map((semana, indiceDaSemana) => (
          <div key={indiceDaSemana} role="row" className="calendario-semana">
            {semana.map((data, indice) =>
              data ? (
                <DiaDoMes
                  key={data}
                  data={data}
                  escolhido={data === valor}
                  ehHoje={data === hoje}
                  alvoDoTab={data === alvoDoTab}
                  aoEscolher={aoEscolher}
                />
              ) : (
                <div key={indice} role="gridcell" />
              ),
            )}
          </div>
        ))}
      </div>
      <div className="calendario-rodape">
        <button type="button" className="calendario-hoje" onClick={() => aoEscolher(hoje)}>
          Hoje
        </button>
      </div>
    </div>
  )
}
