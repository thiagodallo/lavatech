import prisma from '../database/prisma.js'

export function buscarPorEmail(email) {
  return prisma.funcionario.findUnique({ where: { email } })
}
