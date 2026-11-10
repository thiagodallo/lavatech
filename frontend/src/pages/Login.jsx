import { Droplets } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router'

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
      <form className="login-cartao" onSubmit={enviarFormulario}>
        <div className="login-marca">
          <span className="login-marca-icone">
            <Droplets size={18} aria-hidden="true" />
          </span>
          LavaTech
        </div>

        <label className="login-rotulo" htmlFor="login-email">
          E-mail
        </label>
        <input
          id="login-email"
          className="login-campo"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
        />

        <label className="login-rotulo" htmlFor="login-senha">
          Senha
        </label>
        <input
          id="login-senha"
          className="login-campo"
          type="password"
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
      </form>
    </main>
  )
}
