import prisma from '../database/prisma.js'

export function buscarPorEmail(email) {
  return prisma.funcionario.findUnique({ where: { email } })
}

export function buscarPorId(id) {
  return prisma.funcionario.findUnique({ where: { id } })
}
