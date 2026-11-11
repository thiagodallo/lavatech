import prisma from '../database/prisma.js'

export function encerrarDoFuncionario(funcionarioId) {
  return prisma.$executeRaw`DELETE FROM sessao WHERE (sess ->> 'funcionarioId')::int = ${funcionarioId}`
}
