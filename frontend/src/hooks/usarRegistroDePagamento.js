import { useState } from 'react'

import { registrarPagamento } from '../api/pagamentos.js'

const MENSAGEM_SEM_FORMA = 'Escolha a forma de pagamento'
const estadoSemErros = { mensagemDeErro: '', errosDosCampos: {} }

function estadoDoErro(erro) {
  const errosDosCampos = erro.campos ?? {}
  const semCampos = Object.keys(errosDosCampos).length === 0
  return { errosDosCampos, mensagemDeErro: semCampos ? erro.message : '' }
}

export default function usarRegistroDePagamento(agendamentoId, aoRegistrar, aoEncontrarConflito) {
  const [estado, setEstado] = useState(estadoSemErros)
  const [enviando, setEnviando] = useState(false)

  async function registrar(dados) {
    if (!dados.forma_pagamento) {
      setEstado({ ...estadoSemErros, errosDosCampos: { forma_pagamento: [MENSAGEM_SEM_FORMA] } })
      return
    }
    setEstado(estadoSemErros)
    setEnviando(true)
    try {
      aoRegistrar(await registrarPagamento(agendamentoId, dados))
    } catch (erro) {
      if (erro.status === 409) aoEncontrarConflito(erro.message)
      else setEstado(estadoDoErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  return { ...estado, enviando, registrar }
}
