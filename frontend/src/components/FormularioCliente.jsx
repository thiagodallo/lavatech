import { useState } from 'react'

import { cadastrarCliente, editarCliente } from '../api/clientes.js'
import CampoDeTexto from './CampoDeTexto.jsx'

export default function FormularioCliente({ cliente, aoSalvar }) {
  const [nome, setNome] = useState(cliente?.nome ?? '')
  const [telefone, setTelefone] = useState(cliente?.telefone ?? '')
  const [email, setEmail] = useState(cliente?.email ?? '')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function alterarCampo(definirCampo) {
    return (evento) => {
      definirCampo(evento.target.value)
      setSalvo(false)
    }
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    const dados = { nome, telefone, email: email.trim() || null }
    try {
      const clienteSalvo = cliente
        ? await editarCliente(cliente.id, dados)
        : await cadastrarCliente(dados)
      setSalvo(true)
      aoSalvar(clienteSalvo)
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
        id="cliente-nome"
        rotulo="Nome"
        required
        autoComplete="off"
        value={nome}
        erro={errosDosCampos.nome?.[0]}
        onChange={alterarCampo(setNome)}
      />
      <CampoDeTexto
        id="cliente-telefone"
        rotulo="Telefone"
        type="tel"
        required
        autoComplete="off"
        value={telefone}
        erro={errosDosCampos.telefone?.[0]}
        onChange={alterarCampo(setTelefone)}
      />
      <CampoDeTexto
        id="cliente-email"
        rotulo="E-mail"
        type="email"
        autoComplete="off"
        value={email}
        erro={errosDosCampos.email?.[0]}
        onChange={alterarCampo(setEmail)}
      />

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Salvando' : 'Salvar'}
        </button>
        {salvo && (
          <span className="formulario-salvo" role="status">
            Salvo
          </span>
        )}
      </div>
    </form>
  )
}
