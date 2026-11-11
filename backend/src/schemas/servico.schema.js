import { z } from 'zod'

import { valorComDuasCasas } from './decimal.schema.js'

export const DURACAO_MAXIMA_EM_MINUTOS = 720

export const formatoDoServico = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(100, 'Nome muito longo'),
  descricao: z.string().trim().max(500, 'Descrição muito longa').nullish(),
  preco: valorComDuasCasas('Informe o preço'),
  duracao_minutos: z
    .number('Informe a duração')
    .int('Use minutos inteiros')
    .min(1, 'A duração deve ser de pelo menos 1 minuto')
    .max(DURACAO_MAXIMA_EM_MINUTOS, 'Duração muito longa'),
  ativo: z.boolean().default(true),
})

export const formatoDaEdicaoDoServico = formatoDoServico.extend({
  ativo: z.boolean('Informe se o serviço está ativo'),
})

export const formatoDoFiltroDeServicos = z.object({
  ativo: z
    .enum(['true', 'false'])
    .transform((texto) => texto === 'true')
    .optional(),
})
