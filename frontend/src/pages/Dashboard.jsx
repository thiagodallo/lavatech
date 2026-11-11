import SecaoOperacional from '../components/SecaoOperacional.jsx'
import { dataDeHoje } from '../formatacao/horario.js'
import './Dashboard.css'

export default function Dashboard() {
  const hoje = dataDeHoje()

  return (
    <section>
      <header className="dashboard-cabecalho">
        <h1 className="titulo-tela">Dashboard</h1>
      </header>
      <SecaoOperacional hoje={hoje} />
    </section>
  )
}
