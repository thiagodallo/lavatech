import { useEffect } from 'react'
import { Link } from 'react-router'

import logoClara from '../assets/logo-lavatech-clara.png'
import AgendaDeDemonstracao from '../components/AgendaDeDemonstracao.jsx'
import ArquiteturaDoSistema from '../components/ArquiteturaDoSistema.jsx'
import CadernoEWhatsApp from '../components/CadernoEWhatsApp.jsx'
import CenaDoFluxo from '../components/CenaDoFluxo.jsx'
import IndicadorDeSecoes from '../components/IndicadorDeSecoes.jsx'
import LogoAnimada from '../components/LogoAnimada.jsx'
import PainelDemonstrativo from '../components/PainelDemonstrativo.jsx'
import { etapasDoFluxo } from '../dominio/etapasDoFluxo.js'
import usarNavegacaoPorSecoes from '../hooks/usarNavegacaoPorSecoes.js'
import usarSecaoAtual from '../hooks/usarSecaoAtual.js'
import usarTelaCheia from '../hooks/usarTelaCheia.js'
import './Landing.css'

const secoes = [
  { id: 'agenda', rotulo: 'Agenda' },
  { id: 'problema', rotulo: 'Problema' },
  { id: 'fluxo', rotulo: 'Fluxo do atendimento' },
  { id: 'painel', rotulo: 'Dashboard' },
  { id: 'arquitetura', rotulo: 'Arquitetura' },
  { id: 'fim', rotulo: 'Entrar' },
]
const idsDasSecoes = [
  'agenda',
  'problema',
  ...etapasDoFluxo.map((etapa) => etapa.id),
  'painel',
  'arquitetura',
  'fim',
]

function indiceDoPonto(idAtual) {
  return secoes.findIndex((secao) => idAtual === secao.id || idAtual.startsWith(`${secao.id}-`))
}

export default function Landing() {
  usarNavegacaoPorSecoes('[data-secao]')
  usarTelaCheia()
  const secaoAtual = indiceDoPonto(idsDasSecoes[usarSecaoAtual(idsDasSecoes)])

  useEffect(() => {
    document.documentElement.classList.add('pagina-da-landing')
    return () => document.documentElement.classList.remove('pagina-da-landing')
  }, [])

  return (
    <main className="landing">
      <IndicadorDeSecoes secoes={secoes} atual={secaoAtual} />

      <section id="agenda" className="landing-secao landing-abertura" data-secao>
        <header className="landing-topo">
          <LogoAnimada className="landing-logo" />
          <Link to="/login" className="landing-entrar">
            Entrar
          </Link>
        </header>
        <h1 className="landing-titulo">
          <span className="landing-linha">Cada vaga, cada carro,</span>
          <span className="landing-linha">cada atendimento num lugar só.</span>
        </h1>
        <div className="landing-agenda">
          <AgendaDeDemonstracao />
        </div>
      </section>

      <section id="problema" className="landing-secao landing-secao-alternada" data-secao>
        <div className="landing-problema">
          <div className="landing-problema-texto">
            <h2 className="landing-titulo">Quando a agenda é um caderno e um grupo de WhatsApp,</h2>
            <ul className="landing-problemas">
              <li>dois carros acabam na mesma vaga,</li>
              <li>ninguém prova o&nbsp;que foi feito no carro</li>
              <li className="landing-problema-final">
                e o fim do mês vira <span className="landing-problema-alerta">adivinhação.</span>
              </li>
            </ul>
          </div>
          <CadernoEWhatsApp />
        </div>
      </section>

      <CenaDoFluxo />

      <section id="painel" className="landing-secao landing-secao-alternada" data-secao>
        <h2 className="landing-titulo">Quanto entrou e onde o tempo foi, sem fazer conta.</h2>
        <PainelDemonstrativo />
      </section>

      <section id="arquitetura" className="landing-secao" data-secao>
        <h2 className="landing-titulo">Por baixo, uma estrutura simples de manter.</h2>
        <ArquiteturaDoSistema />
      </section>

      <section id="fim" className="landing-secao landing-fechamento" data-secao>
        <img src={logoClara} alt="LavaTech" className="landing-logo-grande" />
        <Link to="/login" className="landing-entrar landing-entrar-grande">
          Entrar no sistema
        </Link>
        <p className="landing-creditos">
          Pensado e desenvolvido por <span>Thiago Dalló</span>, <span>Cauã de Medeiros</span>,{' '}
          <span>Murilo Cambruzzi</span> e <span>Vinicius Fabris</span>
        </p>
      </section>
    </main>
  )
}
