import { createContext, useContext, useEffect, useState } from 'react'

import * as auth from '../api/auth.js'

const SessaoContext = createContext(null)

export function SessaoProvider({ children }) {
  const [funcionario, setFuncionario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    auth
      .buscarFuncionarioLogado()
      .then(setFuncionario)
      .catch(() => setFuncionario(null))
      .finally(() => setCarregando(false))
  }, [])

  async function entrar(email, senha) {
    const logado = await auth.entrar(email, senha)
    setFuncionario(logado)
  }

  async function sair() {
    await auth.sair()
    setFuncionario(null)
  }

  return (
    <SessaoContext value={{ funcionario, carregando, entrar, sair }}>
      {children}
    </SessaoContext>
  )
}

export function useSessao() {
  return useContext(SessaoContext)
}
