import { Prisma } from '@prisma/client'
import { z, ZodError } from 'zod'

import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'

const REGISTRO_DUPLICADO = 'P2002'

export default function tratarErros(erro, req, res, next) {
  if (erro instanceof ZodError) {
    const campos = z.flattenError(erro).fieldErrors
    return res.status(400).json({ erro: 'Dados inválidos', campos })
  }

  if (erro instanceof ErroDeAplicacao) {
    return res.status(erro.status).json({ erro: erro.message })
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido' })
  }

  if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === REGISTRO_DUPLICADO) {
    return res.status(409).json({ erro: 'Registro já existe' })
  }

  console.error(erro)
  res.status(500).json({ erro: 'Erro interno do servidor' })
}
