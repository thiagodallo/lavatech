import prisma from '../database/prisma.js'

const SEM_O_SISTEMA = { papel: { not: 'sistema' } }
const CAMPOS_PUBLICOS = { id: true, nome: true, email: true, papel: true, ativo: true, criado_em: true }

export function buscarPorEmail(email) {
  return prisma.funcionario.findUnique({ where: { email } })
}

export function buscarPorId(id) {
  return prisma.funcionario.findUnique({ where: { id } })
}

export function listar() {
  return prisma.funcionario.findMany({
    where: SEM_O_SISTEMA,
    select: CAMPOS_PUBLICOS,
    orderBy: { nome: 'asc' },
  })
}

export function criar({ nome, email, senhaHash, papel }) {
  return prisma.funcionario.create({
    data: { nome, email, senha_hash: senhaHash, papel },
    select: CAMPOS_PUBLICOS,
  })
}
