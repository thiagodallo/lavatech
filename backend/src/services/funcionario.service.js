import bcrypt from 'bcrypt'

import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as funcionarios from '../repositories/funcionario.repository.js'
import * as sessoes from '../repositories/sessao.repository.js'

const CUSTO_DO_HASH = 12
const PAPEL_UNICO_DO_MVP = 'admin'
const EMAIL_JA_CADASTRADO = 'E-mail já cadastrado'
const FUNCIONARIO_NAO_ENCONTRADO = 'Funcionário não encontrado'
const NAO_DESATIVAR_A_PROPRIA_CONTA = 'Você não pode desativar a própria conta'

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

export async function editarFuncionario(id, { nome, email, ativo, senha }, idDoLogado) {
  const funcionario = await funcionarios.buscarPorId(id)
  if (!funcionario) {
    throw new ErroDeAplicacao(404, FUNCIONARIO_NAO_ENCONTRADO)
  }
  if (id === idDoLogado && !ativo) {
    throw new ErroDeAplicacao(409, NAO_DESATIVAR_A_PROPRIA_CONTA)
  }

  await exigirEmailLivre(email, id)
  const senhaHash = senha ? await bcrypt.hash(senha, CUSTO_DO_HASH) : undefined
  const atualizado = await funcionarios.atualizar(id, { nome, email, ativo, senhaHash })

  const foiDesativado = funcionario.ativo && !ativo
  if ((foiDesativado || senhaHash) && id !== idDoLogado) {
    await sessoes.encerrarDoFuncionario(id)
  }
  return atualizado
}
