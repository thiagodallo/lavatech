import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'

export default function exigirSessao(req, res, next) {
  if (!req.session.funcionarioId) {
    throw new ErroDeAplicacao(401, 'Sessão inexistente ou expirada')
  }
  next()
}
