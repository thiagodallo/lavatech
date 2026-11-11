import { z } from 'zod'

import { valorComDuasCasas } from './decimal.schema.js'

export const formatoDoProduto = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(100, 'Nome muito longo'),
  categoria: z.string().trim().min(1).max(50, 'Categoria muito longa').nullish(),
  unidade_medida: z.string().trim().min(1).max(10, 'Unidade muito longa').nullish(),
  quantidade_minima: valorComDuasCasas('Informe a quantidade mínima').default(0),
})
