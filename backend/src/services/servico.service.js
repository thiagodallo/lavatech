import * as servicos from '../repositories/servico.repository.js'

function formatarServico({ preco, ...servico }) {
  return { ...servico, preco: Number(preco) }
}

export async function listarServicos(filtro) {
  const encontrados = await servicos.listar(filtro)
  return encontrados.map(formatarServico)
}

export async function cadastrarServico(dados) {
  return formatarServico(await servicos.criar(dados))
}
