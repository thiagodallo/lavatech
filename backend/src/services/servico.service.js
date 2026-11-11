import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as servicos from '../repositories/servico.repository.js'

const SERVICO_NAO_ENCONTRADO = 'Serviço não encontrado'

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

export async function editarServico(id, dados) {
  if (!(await servicos.buscarPorId(id))) {
    throw new ErroDeAplicacao(404, SERVICO_NAO_ENCONTRADO)
  }
  return formatarServico(await servicos.atualizar(id, dados))
}
