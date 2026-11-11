import { useState } from 'react'

import { formatarValorParaEditar } from '../formatacao/moeda.js'
import { lerNumero } from '../formatacao/numero.js'
import usarRegistroDePagamento from '../hooks/usarRegistroDePagamento.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import SeletorDeFormaDePagamento from './SeletorDeFormaDePagamento.jsx'

function AcoesDoPagamento({ mensagemDeErro, enviando }) {
  return (
    <>
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
    </>
  )
}

export default function FormularioDePagamento({ agendamento, aoRegistrar, aoEncontrarConflito }) {
  const [valor, setValor] = useState(formatarValorParaEditar(agendamento.preco_total))
  const [forma, setForma] = useState('')
  const registro = usarRegistroDePagamento(agendamento.id, aoRegistrar, aoEncontrarConflito)

  function enviarFormulario(evento) {
    evento.preventDefault()
    registro.registrar({ valor: lerNumero(valor), forma_pagamento: forma })
  }

  return (
    <form className="formulario" onSubmit={enviarFormulario}>
      <CampoDeTexto
        id="pagamento-valor"
        rotulo="Valor"
        inputMode="decimal"
        autoComplete="off"
        value={valor}
        erro={registro.errosDosCampos.valor?.[0]}
        onChange={(evento) => setValor(evento.target.value)}
      />
      <SeletorDeFormaDePagamento valor={forma} erro={registro.errosDosCampos.forma_pagamento?.[0]} aoEscolher={setForma} />
      <AcoesDoPagamento mensagemDeErro={registro.mensagemDeErro} enviando={registro.enviando} />
    </form>
  )
}
