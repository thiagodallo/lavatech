import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { listarAgendamentosDoDia } from '../api/agendamentos.js'
import CartaoDeAgendamento from '../components/CartaoDeAgendamento.jsx'
import { dataDeHoje } from '../formatacao/horario.js'
import './Agenda.css'

export default function Agenda() {
  const data = dataDeHoje()
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarAgenda() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarAgendamentosDoDia(data)
        if (atual) setAgendamentos(encontrados)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarAgenda()
    return () => {
      atual = false
    }
  }, [data, tentativa])

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="agenda-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && agendamentos.length === 0) {
      return (
        <p className="agenda-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (agendamentos.length === 0) {
      return <p className="agenda-estado texto-apoio">Nenhum agendamento neste dia</p>
    }

    return (
      <ul className="agenda-itens">
        {agendamentos.map((agendamento) => (
          <CartaoDeAgendamento key={agendamento.id} agendamento={agendamento} />
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="agenda-cabecalho">
        <h1 className="titulo-tela">Agenda</h1>
        <div className="agenda-acoes">
          <Link to="/agenda/novo" className="botao-primario">
            <Plus size={16} aria-hidden="true" />
            Novo agendamento
          </Link>
        </div>
      </header>

      {corpoDaLista()}
    </section>
  )
}
