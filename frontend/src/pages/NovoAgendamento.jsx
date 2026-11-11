import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { listarServicosAtivos } from '../api/servicos.js'
import { listarVagas } from '../api/vagas.js'
import FormularioDeAgendamento from '../components/FormularioDeAgendamento.jsx'
import { dataDoTexto } from '../formatacao/horario.js'
import './NovoAgendamento.css'

export default function NovoAgendamento() {
  const navegar = useNavigate()
  const [opcoes, setOpcoes] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarOpcoes() {
      setMensagemDeErro('')
      try {
        const [servicos, vagas] = await Promise.all([listarServicosAtivos(), listarVagas()])
        if (atual) setOpcoes({ servicos, vagas })
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      }
    }

    carregarOpcoes()
    return () => {
      atual = false
    }
  }, [tentativa])

  function aoSalvarAgendamento(agendamento) {
    navegar(`/agenda?data=${dataDoTexto(agendamento.data_hora_agendada)}`)
  }

  function corpoDaTela() {
    if (mensagemDeErro) {
      return (
        <div className="novo-agendamento-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (!opcoes) {
      return (
        <p className="novo-agendamento-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    return (
      <FormularioDeAgendamento
        servicos={opcoes.servicos}
        vagas={opcoes.vagas}
        aoSalvar={aoSalvarAgendamento}
      />
    )
  }

  return (
    <section>
      <header className="novo-agendamento-cabecalho">
        <h1 className="titulo-tela">Novo agendamento</h1>
      </header>
      {corpoDaTela()}
    </section>
  )
}
