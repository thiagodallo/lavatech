import { useState } from 'react'
import { Link, Navigate } from 'react-router'

import { cadastrar } from '../api/auth.js'
import logoClara from '../assets/logo-lavatech-clara.png'
import CampoDeLogin from '../components/CampoDeLogin.jsx'
import CampoDeSenha from '../components/CampoDeSenha.jsx'
import { useSessao } from '../contexts/SessaoContext.jsx'
import { validarCadastro } from '../dominio/validacaoDeAcesso.js'
import './Login.css'

function errosDoServidor(erro) {
  return Object.fromEntries(Object.entries(erro.campos ?? {}).map(([campo, mensagens]) => [campo, mensagens[0]]))
}

export default function Cadastro() {
  const { funcionario, entrar } = useSessao()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [mensagemGeral, setMensagemGeral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function alterarCampo(campo, definirValor) {
    return (evento) => {
      definirValor(evento.target.value)
      setErros((atuais) => ({ ...atuais, [campo]: undefined }))
    }
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemGeral('')
    const encontrados = validarCadastro({ nome, email, senha })
    setErros(encontrados)
    const primeiroComErro = Object.keys(encontrados)[0]
    if (primeiroComErro) {
      document.getElementById(`cadastro-${primeiroComErro}`).focus()
      return
    }

    setEnviando(true)
    try {
      const criado = await cadastrar(nome, email, senha)
      if (criado.ativo) {
        await entrar(email, senha)
        return
      }
      setEnviado(true)
    } catch (erro) {
      const doServidor = errosDoServidor(erro)
      setErros(doServidor)
      setMensagemGeral(Object.keys(doServidor).length > 0 ? '' : erro.message)
    } finally {
      setEnviando(false)
    }
  }

  if (funcionario) {
    return <Navigate to="/agenda" replace />
  }

  return (
    <main className="login">
      <section className="login-apresentacao">
        <Link to="/" aria-label="LavaTech, voltar para a apresentação">
          <img src={logoClara} alt="" className="login-logo" />
        </Link>
        <h1 className="login-chamada">Cada vaga, cada carro, cada atendimento num lugar só.</h1>
      </section>

      {enviado ? (
        <section className="login-cartao" role="status">
          <h2 className="login-titulo">Cadastro enviado</h2>
          <p className="login-confirmacao">Aguarde a aprovação de um administrador para entrar.</p>
          <Link to="/login" className="login-entrar login-entrar-link">
            Voltar para entrar
          </Link>
        </section>
      ) : (
        <form className="login-cartao" onSubmit={enviarFormulario} noValidate>
          <h2 className="login-titulo">Cadastrar</h2>

          <p className="login-aviso">Use dados fictícios. Os dados desta demonstração serão apagados após o evento.</p>

          <CampoDeLogin
            id="cadastro-nome"
            rotulo="Nome"
            type="text"
            autoComplete="name"
            maxLength={150}
            erro={erros.nome}
            value={nome}
            onChange={alterarCampo('nome', setNome)}
          />

          <CampoDeLogin
            id="cadastro-email"
            rotulo="E-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            erro={erros.email}
            value={email}
            onChange={alterarCampo('email', setEmail)}
          />

          <CampoDeSenha
            id="cadastro-senha"
            rotulo="Senha"
            variante="login"
            autoComplete="new-password"
            erro={erros.senha}
            value={senha}
            onChange={alterarCampo('senha', setSenha)}
          />

          <p className="login-erro-geral" role="alert">
            {mensagemGeral}
          </p>

          <button type="submit" className="login-entrar" disabled={enviando}>
            {enviando ? 'Enviando' : 'Cadastrar'}
          </button>

          <p className="login-troca">
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      )}
    </main>
  )
}
