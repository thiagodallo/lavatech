import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { buscarPorId } from '../repositories/funcionario.repository.js'

const PAPEL_ADMIN = 'admin'

export default async function exigirAdmin(req, res, next) {
  const funcionario = await buscarPorId(req.session.funcionarioId)
  if (funcionario?.papel !== PAPEL_ADMIN) {
    throw new ErroDeAplicacao(403, 'Apenas administradores podem gerenciar funcionários')
  }
  next()
}
