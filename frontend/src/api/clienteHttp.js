let aoExpirarSessao = null

export function definirAoExpirarSessao(funcao) {
  aoExpirarSessao = funcao
}

export class ErroDaApi extends Error {
  constructor(status, mensagem, campos = {}) {
    super(mensagem)
    this.status = status
    this.campos = campos
  }
}

export async function requisitar(caminho, { metodo = 'GET', corpo } = {}) {
  const resposta = await fetch(`/api${caminho}`, {
    method: metodo,
    headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
    body: corpo ? JSON.stringify(corpo) : undefined,
  })

  if (resposta.status === 204) {
    return null
  }

  const dados = await resposta.json().catch(() => null)
  if (!resposta.ok) {
    if (resposta.status === 401 && !caminho.startsWith('/auth/')) {
      aoExpirarSessao?.()
    }
    throw new ErroDaApi(
      resposta.status,
      dados?.erro ?? 'Não foi possível falar com o servidor',
      dados?.campos,
    )
  }

  return dados
}
