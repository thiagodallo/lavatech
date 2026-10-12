import prisma from '../database/prisma.js'

export async function pingarBanco() {
  await prisma.$queryRaw`SELECT 1`
}
