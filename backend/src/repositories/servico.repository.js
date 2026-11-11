import prisma from '../database/prisma.js'

export function listar({ ativo } = {}) {
  return prisma.servico.findMany({
    where: { ativo },
    orderBy: { nome: 'asc' },
  })
}

export function criar({ nome, descricao, preco, duracao_minutos, ativo }) {
  return prisma.servico.create({
    data: { nome, descricao: descricao || null, preco, duracao_minutos, ativo },
  })
}
