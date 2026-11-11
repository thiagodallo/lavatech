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
