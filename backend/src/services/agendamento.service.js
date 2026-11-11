import * as vagas from '../repositories/vaga.repository.js'

export function listarVagasAtivas() {
  return vagas.listarAtivas()
}
