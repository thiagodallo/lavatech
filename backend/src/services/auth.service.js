import bcrypt from 'bcrypt'

import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { buscarPorEmail } from '../repositories/funcionario.repository.js'

const CREDENCIAIS_INVALIDAS = 'E-mail ou senha inválidos'

function dadosPublicos({ id, nome, email, papel }) {
  return { id, nome, email, papel }
}

export async function autenticar(email, senha) {
  const funcionario = await buscarPorEmail(email)
  if (!funcionario?.ativo || !funcionario.senha_hash) {
    throw new ErroDeAplicacao(401, CREDENCIAIS_INVALIDAS)
  }

  const senhaConfere = await bcrypt.compare(senha, funcionario.senha_hash)
  if (!senhaConfere) {
    throw new ErroDeAplicacao(401, CREDENCIAIS_INVALIDAS)
  }

  return dadosPublicos(funcionario)
}
