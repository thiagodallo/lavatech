import { useEffect } from 'react'
import { Link } from 'react-router'

import logoClara from '../assets/logo-lavatech-clara.png'
import AgendaDeDemonstracao from '../components/AgendaDeDemonstracao.jsx'
import ArquiteturaDoSistema from '../components/ArquiteturaDoSistema.jsx'
import FluxoDoAtendimento from '../components/FluxoDoAtendimento.jsx'
import PainelDemonstrativo from '../components/PainelDemonstrativo.jsx'
import usarNavegacaoPorSecoes from '../hooks/usarNavegacaoPorSecoes.js'
import './Landing.css'

export default function Landing() {
  usarNavegacaoPorSecoes('[data-secao]')

  useEffect(() => {
    document.documentElement.classList.add('pagina-da-landing')
    return () => document.documentElement.classList.remove('pagina-da-landing')
  }, [])

  return (
    <main className="landing">
      <section className="landing-secao landing-abertura" data-secao>
        <header className="landing-topo">
          <img src={logoClara} alt="LavaTech" className="landing-logo" />
          <Link to="/login" className="landing-entrar">
            Entrar
          </Link>
        </header>
        <h1 className="landing-titulo">Cada vaga, cada carro, cada atendimento num lugar só.</h1>
        <AgendaDeDemonstracao />
      </section>

      <section className="landing-secao landing-secao-alternada" data-secao>
        <h2 className="landing-titulo">Quando a agenda é um caderno e um grupo de WhatsApp:</h2>
        <ul className="landing-problemas">
          <li>dois carros acabam na mesma vaga.</li>
          <li>ninguém prova o que foi feito no carro.</li>
          <li>o fim do mês vira adivinhação.</li>
        </ul>
      </section>

      <section className="landing-secao" data-secao>
        <h2 className="landing-titulo">Do agendamento ao pagamento, o mesmo caminho todo dia.</h2>
        <FluxoDoAtendimento />
      </section>

      <section className="landing-secao landing-secao-alternada" data-secao>
        <h2 className="landing-titulo">No fim do dia, quanto entrou e onde o tempo foi.</h2>
        <PainelDemonstrativo />
      </section>

      <section className="landing-secao" data-secao>
        <h2 className="landing-titulo">Por baixo, uma estrutura simples de manter.</h2>
        <ArquiteturaDoSistema />
      </section>

      <section className="landing-secao landing-fechamento" data-secao>
        <img src={logoClara} alt="LavaTech" className="landing-logo-grande" />
        <Link to="/login" className="landing-entrar landing-entrar-grande">
          Entrar no sistema
        </Link>
      </section>
    </main>
  )
}
