import prisma from './prisma.js'

const CHANCE_DE_LIMPAR_EXPIRADOS = 0.02

export default class ArmazemDeLimites {
  constructor(prefixo) {
    this.prefixo = prefixo
    this.janelaEmMs = 0
  }

  init(opcoes) {
    this.janelaEmMs = opcoes.windowMs
  }

  chaveCompleta(chave) {
    return `${this.prefixo}${chave}`
  }

  async increment(chave) {
    const [registro] = await prisma.$queryRaw`
      INSERT INTO limite_requisicao (chave, acessos, reinicia_em)
      VALUES (${this.chaveCompleta(chave)}, 1, now() + ${this.janelaEmMs} * interval '1 millisecond')
      ON CONFLICT (chave) DO UPDATE SET
        acessos = CASE WHEN limite_requisicao.reinicia_em <= now() THEN 1 ELSE limite_requisicao.acessos + 1 END,
        reinicia_em = CASE
          WHEN limite_requisicao.reinicia_em <= now() THEN now() + ${this.janelaEmMs} * interval '1 millisecond'
          ELSE limite_requisicao.reinicia_em
        END
      RETURNING acessos, (extract(epoch FROM reinicia_em) * 1000)::float8 AS reinicia_em_ms
    `
    if (Math.random() < CHANCE_DE_LIMPAR_EXPIRADOS) {
      await prisma.$executeRaw`DELETE FROM limite_requisicao WHERE reinicia_em < now() - interval '1 day'`
    }
    return { totalHits: registro.acessos, resetTime: new Date(registro.reinicia_em_ms) }
  }

  async decrement(chave) {
    await prisma.$executeRaw`
      UPDATE limite_requisicao SET acessos = GREATEST(acessos - 1, 0)
      WHERE chave = ${this.chaveCompleta(chave)}
    `
  }

  async resetKey(chave) {
    await prisma.$executeRaw`DELETE FROM limite_requisicao WHERE chave = ${this.chaveCompleta(chave)}`
  }
}
