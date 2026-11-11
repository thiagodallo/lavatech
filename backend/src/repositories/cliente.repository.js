import prisma from '../database/prisma.js'

const COM_VEICULOS = { veiculo: { orderBy: { id: 'asc' } } }

function filtroDaBusca(busca) {
  const placa = busca.toUpperCase().replace(/[\s-]/g, '')
  const condicoes = [
    { nome: { contains: busca, mode: 'insensitive' } },
    { telefone: { contains: busca } },
  ]
  if (placa) {
    condicoes.push({ veiculo: { some: { placa: { contains: placa } } } })
  }
  return { OR: condicoes }
}

export function listarComVeiculos(busca) {
  return prisma.cliente.findMany({
    where: busca ? filtroDaBusca(busca) : undefined,
    include: COM_VEICULOS,
    orderBy: { nome: 'asc' },
  })
}

export function buscarPorId(id) {
  return prisma.cliente.findUnique({ where: { id } })
}

export function buscarPorTelefone(telefone) {
  return prisma.cliente.findUnique({ where: { telefone } })
}

export function criar({ nome, telefone, email }) {
  return prisma.cliente.create({
    data: { nome, telefone, email: email ?? null },
    include: COM_VEICULOS,
  })
}

export function atualizar(id, { nome, telefone, email }) {
  return prisma.cliente.update({
    where: { id },
    data: { nome, telefone, email: email ?? null },
    include: COM_VEICULOS,
  })
}
