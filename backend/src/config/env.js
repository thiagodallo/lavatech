import { z } from 'zod'

const formatoDoEnv = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  SESSION_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

const env = formatoDoEnv.parse(process.env)

export default env
