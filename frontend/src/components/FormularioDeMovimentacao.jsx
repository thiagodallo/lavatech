import { useState } from 'react'

import { registrarMovimentacao } from '../api/movimentacoes.js'
import { lerNumero } from '../formatacao/numero.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import SeletorDeTipoDeMovimentacao from './SeletorDeTipoDeMovimentacao.jsx'
import './FormularioDeMovimentacao.css'

export default function FormularioDeMovimentacao({ produto, aoRegistrar }) {
  const [tipo, setTipo] = useState('entrada')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [registrado, setRegistrado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function alterarCampo(definirCampo) {
    return (valor) => {
      definirCampo(valor)
      setRegistrado(false)
    }
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setRegistrado(false)
    setEnviando(true)

    try {
      const movimentacao = await registrarMovimentacao({
        produto_id: produto.id,
        tipo,
        quantidade: lerNumero(quantidade),
        observacao: observacao.trim() || undefined,
      })
      setQuantidade('')
      setObservacao('')
      setRegistrado(true)
      aoRegistrar(movimentacao)
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
      <SeletorDeTipoDeMovimentacao valor={tipo} aoEscolher={alterarCampo(setTipo)} />

      <div className="campo">
        <label className="campo-rotulo" htmlFor="movimentacao-quantidade">
          Quantidade
        </label>
        <div className="movimentacao-quantidade">
          <input
            id="movimentacao-quantidade"
            className="campo-entrada"
            inputMode="decimal"
            autoComplete="off"
            value={quantidade}
            aria-invalid={errosDosCampos.quantidade ? true : undefined}
            aria-describedby={errosDosCampos.quantidade ? 'movimentacao-quantidade-erro' : undefined}
            onChange={(evento) => alterarCampo(setQuantidade)(evento.target.value)}
          />
          {produto.unidade_medida && <span className="movimentacao-unidade">{produto.unidade_medida}</span>}
        </div>
        {errosDosCampos.quantidade && (
          <p className="campo-erro" id="movimentacao-quantidade-erro">
            {errosDosCampos.quantidade[0]}
          </p>
        )}
      </div>

      <CampoDeTexto
        id="movimentacao-observacao"
        rotulo="Observação"
        autoComplete="off"
        value={observacao}
        erro={errosDosCampos.observacao?.[0]}
        onChange={(evento) => alterarCampo(setObservacao)(evento.target.value)}
      />

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Registrando' : 'Registrar'}
        </button>
        {registrado && (
          <span className="formulario-salvo" role="status">
            Registrado
          </span>
        )}
      </div>
    </form>
  )
}
