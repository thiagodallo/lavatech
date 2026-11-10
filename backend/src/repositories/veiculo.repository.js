import prisma from '../database/prisma.js'

export function listarPorCliente(clienteId) {
  return prisma.veiculo.findMany({
    where: { cliente_id: clienteId },
    orderBy: { id: 'asc' },
  })
}

export function buscarPorPlaca(placa) {
  return prisma.veiculo.findUnique({ where: { placa } })
}

export function criar(clienteId, { placa, marca, modelo, cor }) {
  return prisma.veiculo.create({
    data: {
      cliente_id: clienteId,
      placa,
      marca: marca ?? null,
      modelo: modelo ?? null,
      cor: cor ?? null,
    },
  })
}
