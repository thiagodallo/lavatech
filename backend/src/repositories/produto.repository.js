import prisma from '../database/prisma.js'

export function listar() {
  return prisma.produto.findMany({ orderBy: { nome: 'asc' } })
}

export function criar({ nome, categoria, unidade_medida, quantidade_minima }) {
  return prisma.produto.create({
    data: {
      nome,
      categoria: categoria ?? null,
      unidade_medida: unidade_medida ?? null,
      quantidade_minima,
    },
  })
}

export function buscarPorId(id) {
  return prisma.produto.findUnique({ where: { id } })
}

export function atualizar(id, { nome, categoria, unidade_medida, quantidade_minima }) {
  return prisma.produto.update({
    where: { id },
    data: {
      nome,
      categoria: categoria ?? null,
      unidade_medida: unidade_medida ?? null,
      quantidade_minima,
    },
  })
}
