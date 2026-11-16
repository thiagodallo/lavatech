import { useEffect, useRef, useState } from 'react'

import { etapasDoFluxo } from '../dominio/etapasDoFluxo.js'
import FluxoDoAtendimento from './FluxoDoAtendimento.jsx'
import { TelaDeAtendimento, TelaDeHorarios, TelaDePagamento, TelaDoChecklist } from './TelasDoFluxo.jsx'
import './CenaDoFluxo.css'

const telas = [TelaDeHorarios, TelaDeAtendimento, TelaDoChecklist, TelaDePagamento]
const titulo = 'Do agendamento ao pagamento, o mesmo caminho todo dia.'

export default function CenaDoFluxo() {
  const [etapaAtual, setEtapaAtual] = useState(0)
  const ancoras = useRef([])

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((entrada) => entrada.isIntersecting)
        if (visivel) setEtapaAtual(ancoras.current.indexOf(visivel.target))
      },
      { threshold: 0.5 },
    )

    ancoras.current.forEach((ancora) => ancora && observador.observe(ancora))
    return () => observador.disconnect()
  }, [])

  return (
    <>
      <section className="landing-secao cena-lista" data-secao>
        <h2 className="landing-titulo">{titulo}</h2>
        <FluxoDoAtendimento />
      </section>

      <div className="cena-fixa">
        <div className="cena-palco">
          <div className="cena-texto">
            <h2 className="landing-titulo">{titulo}</h2>
            <ol className="cena-etapas">
              {etapasDoFluxo.map((etapa, indice) => (
                <li key={etapa.id} className={`cena-etapa${indice === etapaAtual ? ' cena-etapa-ativa' : ''}`}>
                  <span className="cena-etapa-numero">{String(indice + 1).padStart(2, '0')}</span>
                  <h3 className="cena-etapa-titulo">{etapa.titulo}</h3>
                  <p className="cena-etapa-texto">{etapa.texto}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="cena-telas">
            {telas.map((Tela, indice) => (
              <div
                key={etapasDoFluxo[indice].id}
                className={`cena-tela${indice === etapaAtual ? ' cena-tela-ativa' : ''}`}
                aria-hidden={indice !== etapaAtual}
              >
                <Tela />
              </div>
            ))}
          </div>
        </div>

        {etapasDoFluxo.map((etapa, indice) => (
          <div
            key={etapa.id}
            id={etapa.id}
            ref={(elemento) => {
              ancoras.current[indice] = elemento
            }}
            className="cena-ancora"
            data-secao
          />
        ))}
      </div>
    </>
  )
}
