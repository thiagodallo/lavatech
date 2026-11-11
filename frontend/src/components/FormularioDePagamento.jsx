import { useState } from 'react'

import { registrarPagamento } from '../api/pagamentos.js'
import { formatarValorParaEditar } from '../formatacao/moeda.js'
import { lerNumero } from '../formatacao/numero.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import SeletorDeFormaDePagamento from './SeletorDeFormaDePagamento.jsx'

export default function FormularioDePagamento({ agendamento, aoRegistrar }) {
  const [valor, setValor] = useState(formatarValorParaEditar(agendamento.servico.preco))
  const [forma, setForma] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})

    if (!forma) {
      setErrosDosCampos({ forma_pagamento: ['Escolha a forma de pagamento'] })
      return
    }

    setEnviando(true)
    try {
      const registrado = await registrarPagamento(agendamento.id, {
        valor: lerNumero(valor),
        forma_pagamento: forma,
      })
      aoRegistrar(registrado)
    } catch (erro) {
      const camposComErro = erro.campos ?? {}
      setErrosDosCampos(camposComErro)
      setMensagemDeErro(Object.keys(camposComErro).length > 0 ? '' : erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviarFormulario}>
      <CampoDeTexto
        id="pagamento-valor"
        rotulo="Valor"
        inputMode="decimal"
        autoComplete="off"
        value={valor}
        erro={errosDosCampos.valor?.[0]}
        onChange={(evento) => setValor(evento.target.value)}
      />
      <SeletorDeFormaDePagamento
        valor={forma}
        erro={errosDosCampos.forma_pagamento?.[0]}
        aoEscolher={setForma}
      />

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Registrando' : 'Registrar pagamento'}
        </button>
      </div>
    </form>
  )
}
