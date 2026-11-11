import prisma from '../database/prisma.js'

export function listar({ ativo } = {}) {
  return prisma.servico.findMany({
    where: { ativo },
    orderBy: { nome: 'asc' },
  })
}

export function listarPorIds(ids) {
  return prisma.servico.findMany({ where: { id: { in: ids } } })
}

export function criar({ nome, descricao, preco, duracao_minutos, ativo }) {
  return prisma.servico.create({
    data: { nome, descricao: descricao || null, preco, duracao_minutos, ativo },
  })
}

export function buscarPorId(id) {
  return prisma.servico.findUnique({ where: { id } })
}

export function atualizar(id, { nome, descricao, preco, duracao_minutos, ativo }) {
  return prisma.servico.update({
    where: { id },
    data: { nome, descricao: descricao || null, preco, duracao_minutos, ativo },
  })
}
