import { useState } from 'react'

import { dataDeHoje } from '../formatacao/horario.js'

const camposDeHorario = ['vagaId', 'data', 'hora']

function camposIniciais() {
  return { cliente: null, veiculoId: '', servicoIds: [], vagaId: '', data: dataDeHoje(), hora: '', observacoes: '' }
}

function veiculoDoUnicoVeiculo(cliente) {
  return cliente?.veiculos.length === 1 ? String(cliente.veiculos[0].id) : ''
}

export default function usarCamposDoAgendamento(aoAlterarHorario) {
  const [campos, setCampos] = useState(camposIniciais)

  function alterar(campo) {
    return (valor) => {
      setCampos((atuais) => ({ ...atuais, [campo]: valor }))
      if (camposDeHorario.includes(campo)) aoAlterarHorario()
    }
  }

  function escolherCliente(cliente) {
    setCampos((atuais) => ({ ...atuais, cliente, veiculoId: veiculoDoUnicoVeiculo(cliente) }))
  }

  function alternarServico(id) {
    const marcar = (ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id])
    setCampos((atuais) => ({ ...atuais, servicoIds: marcar(atuais.servicoIds) }))
  }

  return { ...campos, alterar, escolherCliente, alternarServico }
}
