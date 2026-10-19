import { requisitar } from './clienteHttp.js'

export function entrar(email, senha) {
  return requisitar('/auth/login', { metodo: 'POST', corpo: { email, senha } })
}

export function sair() {
  return requisitar('/auth/logout', { metodo: 'POST' })
}

export function buscarFuncionarioLogado() {
  return requisitar('/auth/me')
}
