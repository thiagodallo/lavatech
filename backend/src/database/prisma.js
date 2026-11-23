import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

import conexao from './conexao.js'

const adapter = new PrismaPg(conexao)
const prisma = new PrismaClient({ adapter })

export default prisma
