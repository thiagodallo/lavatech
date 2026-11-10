import { Droplets } from 'lucide-react'
import { useState } from 'react'

import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  function enviarFormulario(evento) {
    evento.preventDefault()
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

        <button type="submit" className="login-entrar">
          Entrar
        </button>
      </form>
    </main>
  )
}
