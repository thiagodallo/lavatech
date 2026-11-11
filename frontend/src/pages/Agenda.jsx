import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { listarAgendamentosDoDia, mudarStatusDoAgendamento } from '../api/agendamentos.js'
import CartaoDeAgendamento from '../components/CartaoDeAgendamento.jsx'
import SeletorDeDia from '../components/SeletorDeDia.jsx'
import { dataDeHoje, ehDataValida } from '../formatacao/horario.js'
import './Agenda.css'

export default function Agenda() {
  const [parametros, definirParametros] = useSearchParams()
  const hoje = dataDeHoje()
  const dataDaUrl = parametros.get('data')
  const data = ehDataValida(dataDaUrl) ? dataDaUrl : hoje
  const [agendamentos, setAgendamentos] = useState([])
  const [diaCarregado, setDiaCarregado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [idEmAcao, setIdEmAcao] = useState(null)
  const [errosPorId, setErrosPorId] = useState({})
  const agendamentosDoDia = diaCarregado === data ? agendamentos : []

  useEffect(() => {
    let atual = true

    async function carregarAgenda() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarAgendamentosDoDia(data)
        if (!atual) return
        setAgendamentos(encontrados)
        setDiaCarregado(data)
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

  async function mudarStatus(agendamento, novoStatus) {
    setIdEmAcao(agendamento.id)
    definirErroDoAgendamento(agendamento.id, '')
    try {
      const atualizado = await mudarStatusDoAgendamento(agendamento.id, novoStatus)
      setAgendamentos((lista) => lista.map((item) => (item.id === atualizado.id ? atualizado : item)))
    } catch (erro) {
      definirErroDoAgendamento(agendamento.id, erro.message)
      if (erro.status === 409) setTentativa((anterior) => anterior + 1)
    } finally {
      setIdEmAcao(null)
    }
  }

  function definirErroDoAgendamento(id, mensagem) {
    setErrosPorId((erros) => ({ ...erros, [id]: mensagem }))
  }

  function mudarDia(novaData) {
    definirParametros(novaData === hoje ? {} : { data: novaData })
  }

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

    if (carregando && agendamentosDoDia.length === 0) {
      return (
        <p className="agenda-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (agendamentosDoDia.length === 0) {
      return <p className="agenda-estado texto-apoio">Nenhum agendamento neste dia</p>
    }

    return (
      <ul className="agenda-itens">
        {agendamentosDoDia.map((agendamento) => (
          <CartaoDeAgendamento
            key={agendamento.id}
            agendamento={agendamento}
            ocupado={idEmAcao === agendamento.id}
            mensagemDeErro={errosPorId[agendamento.id]}
            aoMudarStatus={(novoStatus) => mudarStatus(agendamento, novoStatus)}
          />
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="agenda-cabecalho">
        <h1 className="titulo-tela">Agenda</h1>
        <div className="agenda-acoes">
          <SeletorDeDia data={data} hoje={hoje} aoMudar={mudarDia} />
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
