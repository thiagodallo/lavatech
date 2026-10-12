import { pingarBanco } from '../repositories/health.repository.js'

export async function consultarSaude() {
  await pingarBanco()
  return { api: 'ok', banco: 'ok' }
}
