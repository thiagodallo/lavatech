import { useState } from 'react'
import { Link, Navigate } from 'react-router'

import { cadastrar } from '../api/auth.js'
import logoClara from '../assets/logo-lavatech-clara.png'
import { useSessao } from '../contexts/SessaoContext.jsx'
import './Login.css'

export default function Cadastro() {
  const { funcionario } = useSessao()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setEnviando(true)
    try {
      await cadastrar(nome, email, senha)
      setEnviado(true)
    } catch (erro) {
      setMensagemDeErro(erro.campos?.senha?.[0] ?? erro.message)
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
        <form className="login-cartao" onSubmit={enviarFormulario}>
          <h2 className="login-titulo">Cadastrar</h2>

          <label className="login-rotulo" htmlFor="cadastro-nome">
            Nome
          </label>
          <input
            id="cadastro-nome"
            className="login-campo"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={150}
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />

          <label className="login-rotulo" htmlFor="cadastro-email">
            E-mail
          </label>
          <input
            id="cadastro-email"
            className="login-campo"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <label className="login-rotulo" htmlFor="cadastro-senha">
            Senha
          </label>
          <input
            id="cadastro-senha"
            className="login-campo"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />

          {mensagemDeErro && (
            <p className="login-erro" role="alert">
              {mensagemDeErro}
            </p>
          )}

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
