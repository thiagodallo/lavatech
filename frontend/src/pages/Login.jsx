import { useState } from 'react'
import { Link, Navigate } from 'react-router'

import logoClara from '../assets/logo-lavatech-clara.png'
import CampoDeLogin from '../components/CampoDeLogin.jsx'
import CampoDeSenha from '../components/CampoDeSenha.jsx'
import { useSessao } from '../contexts/SessaoContext.jsx'
import { validarLogin } from '../dominio/validacaoDeAcesso.js'
import './Login.css'

export default function Login() {
  const { funcionario, entrar } = useSessao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [mensagemGeral, setMensagemGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function alterarCampo(campo, definirValor) {
    return (evento) => {
      definirValor(evento.target.value)
      setErros((atuais) => ({ ...atuais, [campo]: undefined }))
    }
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemGeral('')
    const encontrados = validarLogin({ email, senha })
    setErros(encontrados)
    const primeiroComErro = Object.keys(encontrados)[0]
    if (primeiroComErro) {
      document.getElementById(`login-${primeiroComErro}`).focus()
      return
    }

    setEnviando(true)
    try {
      await entrar(email, senha)
    } catch (erro) {
      if (erro.status === 401) setErros({ senha: erro.message })
      else setMensagemGeral(erro.message)
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

      <form className="login-cartao" onSubmit={enviarFormulario} noValidate>
        <h2 className="login-titulo">Entrar</h2>

        <CampoDeLogin
          id="login-email"
          rotulo="E-mail"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          erro={erros.email}
          value={email}
          onChange={alterarCampo('email', setEmail)}
        />

        <CampoDeSenha
          id="login-senha"
          rotulo="Senha"
          variante="login"
          autoComplete="current-password"
          erro={erros.senha}
          value={senha}
          onChange={alterarCampo('senha', setSenha)}
        />

        <p className="login-erro-geral" role="alert">
          {mensagemGeral}
        </p>

        <button type="submit" className="login-entrar" disabled={enviando}>
          {enviando ? 'Entrando' : 'Entrar'}
        </button>

        <p className="login-troca">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se!</Link>
        </p>
      </form>
    </main>
  )
}
