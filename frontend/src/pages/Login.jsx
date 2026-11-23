import { useState } from 'react'
import { Link, Navigate } from 'react-router'

import logoClara from '../assets/logo-lavatech-clara.png'
import CampoDeSenha from '../components/CampoDeSenha.jsx'
import { useSessao } from '../contexts/SessaoContext.jsx'
import './Login.css'

export default function Login() {
  const { funcionario, entrar } = useSessao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setEnviando(true)
    try {
      await entrar(email, senha)
    } catch (erro) {
      setMensagemDeErro(erro.message)
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

      <form className="login-cartao" onSubmit={enviarFormulario}>
        <h2 className="login-titulo">Entrar</h2>

        <label className="login-rotulo" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          className="login-campo"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />

        <CampoDeSenha
          id="login-senha"
          rotulo="Senha"
          variante="login"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />

        {mensagemDeErro && (
          <p className="login-erro" role="alert">
            {mensagemDeErro}
          </p>
        )}

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
