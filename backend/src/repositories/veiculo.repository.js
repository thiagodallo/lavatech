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

export function buscarPorId(id) {
  return prisma.veiculo.findUnique({ where: { id } })
}

export function contarAgendamentos(id) {
  return prisma.agendamento.count({ where: { veiculo_id: id } })
}

export function atualizar(id, { placa, marca, modelo, cor }) {
  return prisma.veiculo.update({
    where: { id },
    data: { placa, marca: marca ?? null, modelo: modelo ?? null, cor: cor ?? null },
  })
}

export function remover(id) {
  return prisma.veiculo.delete({ where: { id } })
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
