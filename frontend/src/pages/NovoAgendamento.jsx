import FormularioDeAgendamento from '../components/FormularioDeAgendamento.jsx'
import './NovoAgendamento.css'

export default function NovoAgendamento() {
  return (
    <section>
      <header className="novo-agendamento-cabecalho">
        <h1 className="titulo-tela">Novo agendamento</h1>
      </header>
      <FormularioDeAgendamento />
    </section>
  )
}
