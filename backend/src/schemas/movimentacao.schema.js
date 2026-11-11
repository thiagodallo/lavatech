import { z } from 'zod'

import { valorPositivoComDuasCasas } from './decimal.schema.js'

export const TIPOS_DE_MOVIMENTACAO = ['entrada', 'saida']

export const formatoDaMovimentacao = z.object({
  produto_id: z.number('Informe o produto').int('Informe o produto').positive('Informe o produto'),
  tipo: z.enum(TIPOS_DE_MOVIMENTACAO, 'Tipo inválido, use entrada ou saida'),
  quantidade: valorPositivoComDuasCasas('Informe a quantidade'),
  observacao: z.string().trim().max(500, 'Observação muito longa').nullish(),
})

export const formatoDoFiltroDeMovimentacoes = z.object({
  produto_id: z.coerce
    .number('Produto inválido')
    .int('Produto inválido')
    .positive('Produto inválido')
    .optional(),
  limite: z.coerce
    .number('Limite inválido')
    .int('Limite deve ser um número inteiro')
    .min(1, 'Limite deve ser de 1 a 200')
    .max(200, 'Limite deve ser de 1 a 200')
    .default(50),
})
