import { useState } from 'react'

import { cadastrarAgendamento } from '../api/agendamentos.js'

const MENSAGEM_SEM_SERVICO = 'Escolha ao menos um serviço'
const estadoSemErros = { mensagemDeErro: '', erroDeHorario: '', errosDosCampos: {} }

function estadoDoErro(erro) {
  const errosDosCampos = erro.campos ?? {}
  if (erro.status === 409) return { ...estadoSemErros, errosDosCampos, erroDeHorario: erro.message }
  const semCampos = Object.keys(errosDosCampos).length === 0
  return { ...estadoSemErros, errosDosCampos, mensagemDeErro: semCampos ? erro.message : '' }
}

export default function usarEnvioDoAgendamento(aoSalvar) {
  const [estado, setEstado] = useState(estadoSemErros)
  const [enviando, setEnviando] = useState(false)

  async function enviar(dados) {
    if (dados.servico_ids.length === 0) {
      setEstado({ ...estadoSemErros, errosDosCampos: { servico_ids: [MENSAGEM_SEM_SERVICO] } })
      return
    }
    setEstado(estadoSemErros)
    setEnviando(true)
    try {
      aoSalvar(await cadastrarAgendamento(dados))
    } catch (erro) {
      setEstado(estadoDoErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  function limparErroDeHorario() {
    setEstado((atual) => ({ ...atual, erroDeHorario: '' }))
  }

  return { ...estado, enviando, enviar, limparErroDeHorario }
}
