import { z } from 'zod'

export const identificador = z.coerce.number().int().positive()
