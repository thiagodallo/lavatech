import bcrypt from 'bcrypt'

import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { buscarPorEmail, buscarPorId } from '../repositories/funcionario.repository.js'
import { cadastrarAtendente } from './funcionario.service.js'

const CREDENCIAIS_INVALIDAS = 'E-mail ou senha inválidos'
const CONTA_INATIVA = 'Conta aguardando aprovação ou desativada. Fale com um administrador.'

function dadosPublicos({ id, nome, email, papel }) {
  return { id, nome, email, papel }
}

export async function autenticar(email, senha) {
  const funcionario = await buscarPorEmail(email)
  if (!funcionario?.senha_hash) {
    throw new ErroDeAplicacao(401, CREDENCIAIS_INVALIDAS)
  }

  const senhaConfere = await bcrypt.compare(senha, funcionario.senha_hash)
  if (!senhaConfere) {
    throw new ErroDeAplicacao(401, CREDENCIAIS_INVALIDAS)
  }
  if (!funcionario.ativo) {
    throw new ErroDeAplicacao(403, CONTA_INATIVA)
  }

  return dadosPublicos(funcionario)
}

export async function cadastrar(dados) {
  const criado = await cadastrarAtendente(dados)
  return { ...dadosPublicos(criado), ativo: criado.ativo }
}

export async function buscarFuncionarioLogado(id) {
  const funcionario = await buscarPorId(id)
  if (!funcionario?.ativo) {
    throw new ErroDeAplicacao(401, 'Sessão inexistente ou expirada')
  }

  return dadosPublicos(funcionario)
}
