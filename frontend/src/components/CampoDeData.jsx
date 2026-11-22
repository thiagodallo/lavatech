import { ChevronDown } from 'lucide-react'
import { useId, useRef, useState } from 'react'

import { nomeDoDia } from '../dominio/datasDoCalendario.js'
import { dataDeHoje } from '../formatacao/horario.js'
import Calendario from './Calendario.jsx'
import './CampoDeData.css'

const LARGURA_DO_CALENDARIO = 316
const ALTURA_DO_CALENDARIO = 360
const MARGEM_DA_TELA = 8
const DISTANCIA_DO_BOTAO = 4

function posicaoDoCalendario(botao) {
  const area = botao.getBoundingClientRect()
  const esquerda = Math.max(MARGEM_DA_TELA, Math.min(area.left, window.innerWidth - LARGURA_DO_CALENDARIO - MARGEM_DA_TELA))
  const cabeEmbaixo = area.bottom + DISTANCIA_DO_BOTAO + ALTURA_DO_CALENDARIO < window.innerHeight
  const topo = cabeEmbaixo
    ? area.bottom + DISTANCIA_DO_BOTAO
    : Math.max(MARGEM_DA_TELA, area.top - DISTANCIA_DO_BOTAO - ALTURA_DO_CALENDARIO)
  const origemX = area.left - esquerda + area.width / 2
  return { left: `${esquerda}px`, top: `${topo}px`, transformOrigin: `${origemX}px ${cabeEmbaixo ? 'top' : 'bottom'}` }
}

export default function CampoDeData({ id, valor, aoEscolher, rotulo, classe = '', descritoPor }) {
  const botao = useRef(null)
  const camada = useRef(null)
  const [aberto, setAberto] = useState(false)
  const idDaCamada = useId()
  const hoje = dataDeHoje()

  function alternar() {
    if (aberto) {
      camada.current.hidePopover()
      return
    }
    Object.assign(camada.current.style, posicaoDoCalendario(botao.current))
    camada.current.showPopover()
  }

  function escolher(data) {
    aoEscolher(data)
    camada.current.hidePopover()
    botao.current.focus()
  }

  return (
    <>
      <button
        ref={botao}
        id={id}
        type="button"
        className={`campo-de-data ${classe}`}
        aria-label={rotulo}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-controls={idDaCamada}
        aria-describedby={descritoPor}
        onClick={alternar}
      >
        <span>{nomeDoDia(valor)}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div
        ref={camada}
        id={idDaCamada}
        popover="auto"
        role="dialog"
        aria-label="Escolher dia"
        className="campo-de-data-camada"
        onToggle={(evento) => setAberto(evento.newState === 'open')}
      >
        {aberto && <Calendario valor={valor} hoje={hoje} aoEscolher={escolher} />}
      </div>
    </>
  )
}
