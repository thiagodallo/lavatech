import { useEffect, useState } from 'react'

import { listarServicosAtivos } from '../api/servicos.js'
import { listarVagas } from '../api/vagas.js'
import Dialogo from './Dialogo.jsx'
import FormularioDeAgendamento from './FormularioDeAgendamento.jsx'

export default function DialogoDeNovoAgendamento({ aoSalvar, aoFechar }) {
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

  function corpoDoDialogo() {
    if (mensagemDeErro) {
      return (
        <div className="dialogo-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (!opcoes) {
      return (
        <p className="dialogo-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    return (
      <FormularioDeAgendamento
        servicos={opcoes.servicos}
        vagas={opcoes.vagas}
        aoSalvar={aoSalvar}
        aoCancelar={aoFechar}
      />
    )
  }

  return (
    <Dialogo titulo="Novo agendamento" aoFechar={aoFechar}>
      {corpoDoDialogo()}
    </Dialogo>
  )
}
