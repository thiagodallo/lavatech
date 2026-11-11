import { useState } from 'react'

import SecaoFinanceira from '../components/SecaoFinanceira.jsx'
import SecaoOperacional from '../components/SecaoOperacional.jsx'
import SeletorDePeriodo from '../components/SeletorDePeriodo.jsx'
import { dataDeHoje, somarDias } from '../formatacao/horario.js'
import './Dashboard.css'

export default function Dashboard() {
  const hoje = dataDeHoje()
  const [periodo, setPeriodo] = useState({ de: somarDias(hoje, -29), ate: hoje })

  return (
    <section>
      <header className="dashboard-cabecalho">
        <h1 className="titulo-tela">Dashboard</h1>
        <SeletorDePeriodo periodo={periodo} hoje={hoje} aoMudar={setPeriodo} />
      </header>
      <SecaoOperacional hoje={hoje} />
      <SecaoFinanceira periodo={periodo} />
    </section>
  )
}
