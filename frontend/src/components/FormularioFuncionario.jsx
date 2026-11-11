import { useState } from 'react'

import { cadastrarFuncionario, editarFuncionario } from '../api/funcionarios.js'
import CampoDeTexto from './CampoDeTexto.jsx'

export default function FormularioFuncionario({ funcionario, contaPropria, aoSalvar }) {
  const [nome, setNome] = useState(funcionario?.nome ?? '')
  const [email, setEmail] = useState(funcionario?.email ?? '')
  const [senha, setSenha] = useState('')
  const [ativo, setAtivo] = useState(funcionario?.ativo ?? true)
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

  function alterarAtivo(evento) {
    setAtivo(evento.target.checked)
    setSalvo(false)
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    try {
      const funcionarioSalvo = funcionario
        ? await editarFuncionario(funcionario.id, { nome, email, ativo, senha: senha || undefined })
        : await cadastrarFuncionario({ nome, email, senha })
      setSenha('')
      setSalvo(true)
      aoSalvar(funcionarioSalvo)
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
        id="funcionario-nome"
        rotulo="Nome"
        required
        autoComplete="off"
        value={nome}
        erro={errosDosCampos.nome?.[0]}
        onChange={alterarCampo(setNome)}
      />
      <CampoDeTexto
        id="funcionario-email"
        rotulo="E-mail"
        type="email"
        required
        autoComplete="off"
        value={email}
        erro={errosDosCampos.email?.[0]}
        onChange={alterarCampo(setEmail)}
      />
      <CampoDeTexto
        id="funcionario-senha"
        rotulo={funcionario ? 'Nova senha' : 'Senha'}
        type="password"
        required={!funcionario}
        autoComplete="new-password"
        value={senha}
        erro={errosDosCampos.senha?.[0]}
        onChange={alterarCampo(setSenha)}
      />
      {funcionario && (
        <label className="campo-caixa">
          <input type="checkbox" checked={ativo} disabled={contaPropria} onChange={alterarAtivo} />
          Ativo
        </label>
      )}

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
