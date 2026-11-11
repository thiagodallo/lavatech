import prisma from '../database/prisma.js'

export function listarAtivas() {
  return prisma.vaga_lavagem.findMany({
    where: { ativo: true },
    select: { id: true, identificacao: true },
    orderBy: { id: 'asc' },
  })
}

export function buscarPorId(id) {
  return prisma.vaga_lavagem.findUnique({ where: { id } })
}
