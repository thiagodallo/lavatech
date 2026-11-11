import bcrypt from 'bcrypt'

import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as funcionarios from '../repositories/funcionario.repository.js'

const CUSTO_DO_HASH = 12
const PAPEL_UNICO_DO_MVP = 'admin'
const EMAIL_JA_CADASTRADO = 'E-mail já cadastrado'

async function exigirEmailLivre(email, idDoFuncionario) {
  const existente = await funcionarios.buscarPorEmail(email)
  if (existente && existente.id !== idDoFuncionario) {
    throw new ErroDeAplicacao(409, EMAIL_JA_CADASTRADO)
  }
}

export function listarFuncionarios() {
  return funcionarios.listar()
}

export async function cadastrarFuncionario({ nome, email, senha }) {
  await exigirEmailLivre(email)
  const senhaHash = await bcrypt.hash(senha, CUSTO_DO_HASH)
  return funcionarios.criar({ nome, email, senhaHash, papel: PAPEL_UNICO_DO_MVP })
}
