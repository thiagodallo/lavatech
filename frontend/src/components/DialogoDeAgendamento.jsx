import { useEffect, useState } from 'react'

import { listarClientes } from '../api/clientes.js'
import { buscarExpediente } from '../api/expediente.js'
import { listarServicosAtivos } from '../api/servicos.js'
import { listarVagas } from '../api/vagas.js'
import Dialogo from './Dialogo.jsx'
import EsqueletoDeBloco from './EsqueletoDeBloco.jsx'
import FormularioDeAgendamento from './FormularioDeAgendamento.jsx'

async function clienteDoAgendamento(agendamento) {
  if (!agendamento) return null
  const encontrados = await listarClientes(agendamento.cliente.telefone)
  const encontrado = encontrados.find((cliente) => cliente.id === agendamento.cliente.id)
  return encontrado ?? { ...agendamento.cliente, veiculos: [agendamento.veiculo] }
}

export default function DialogoDeAgendamento({ agendamento, aoSalvar, aoFechar }) {
  const [opcoes, setOpcoes] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarOpcoes() {
      setMensagemDeErro('')
      try {
        const [servicos, vagas, expediente, cliente] = await Promise.all([
          listarServicosAtivos(),
          listarVagas(),
          buscarExpediente(),
          clienteDoAgendamento(agendamento),
        ])
        if (atual) setOpcoes({ servicos, vagas, expediente, cliente })
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
        <EsqueletoDeBloco linhas={4} rotulo="Carregando o formulário" />
      )
    }

    return (
      <FormularioDeAgendamento
        servicos={opcoes.servicos}
        vagas={opcoes.vagas}
        expediente={opcoes.expediente}
        agendamento={agendamento}
        clienteDoAgendamento={opcoes.cliente}
        aoSalvar={aoSalvar}
        aoCancelar={aoFechar}
      />
    )
  }

  return (
    <Dialogo titulo={agendamento ? 'Editar agendamento' : 'Novo agendamento'} aoFechar={aoFechar}>
      {corpoDoDialogo()}
    </Dialogo>
  )
}
