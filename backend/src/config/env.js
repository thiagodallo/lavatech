import { z } from 'zod'

const formatoDoEnv = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
})

const env = formatoDoEnv.parse(process.env)

export default env
