import { z } from 'zod'

export const formatoDoLogin = z.object({
  email: z.email().toLowerCase(),
  senha: z.string().min(1),
})
