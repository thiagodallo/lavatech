export default class ErroDeAplicacao extends Error {
  constructor(status, mensagem) {
    super(mensagem)
    this.status = status
  }
}
