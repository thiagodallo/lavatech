import { useState } from 'react'

import FechamentoDoDia from '../components/FechamentoDoDia.jsx'
import SecaoFinanceira from '../components/SecaoFinanceira.jsx'
import SecaoOperacional from '../components/SecaoOperacional.jsx'
import SeletorDePeriodo from '../components/SeletorDePeriodo.jsx'
import { useSessao } from '../contexts/SessaoContext.jsx'
import { ehAdmin } from '../dominio/permissoes.js'
import { dataDeHoje, somarDias } from '../formatacao/horario.js'
import './Dashboard.css'

export default function Dashboard() {
  const { funcionario } = useSessao()
  const hoje = dataDeHoje()
  const [periodo, setPeriodo] = useState({ de: somarDias(hoje, -29), ate: hoje })

  return (
    <section>
      <header className="dashboard-cabecalho">
        <h1 className="titulo-tela">Dashboard</h1>
        <SeletorDePeriodo periodo={periodo} hoje={hoje} aoMudar={setPeriodo} />
      </header>
      {ehAdmin(funcionario) && <FechamentoDoDia hoje={hoje} />}
      <SecaoOperacional hoje={hoje} periodo={periodo} />
      {ehAdmin(funcionario) && <SecaoFinanceira periodo={periodo} />}
    </section>
  )
}
