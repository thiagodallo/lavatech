import { z } from 'zod'

import { valorPositivoComDuasCasas } from './decimal.schema.js'

export const FORMAS_DE_PAGAMENTO = ['dinheiro', 'pix', 'cartao_debito', 'cartao_credito']

export const formatoDoPagamento = z.object({
  valor: valorPositivoComDuasCasas('Informe o valor'),
  forma_pagamento: z.enum(FORMAS_DE_PAGAMENTO, 'Forma de pagamento inválida'),
})
