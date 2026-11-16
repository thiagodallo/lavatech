import { useState } from 'react'

import { registrarMovimentacao } from '../api/movimentacoes.js'
import { cadastrarProduto, editarProduto } from '../api/produtos.js'
import { unidadesComAtual } from '../dominio/unidadesDeMedida.js'
import { lerNumero } from '../formatacao/numero.js'
import { formatarQuantidade } from '../formatacao/quantidade.js'
import CampoDeSelecao from './CampoDeSelecao.jsx'
import CampoDeTexto from './CampoDeTexto.jsx'

export default function FormularioProduto({ produto, aoSalvar, aoCriar }) {
  const [nome, setNome] = useState(produto?.nome ?? '')
  const [categoria, setCategoria] = useState(produto?.categoria ?? '')
  const [unidade, setUnidade] = useState(produto?.unidade_medida ?? '')
  const [minimo, setMinimo] = useState(produto ? String(produto.quantidade_minima).replace('.', ',') : '')
  const [quantidadeInicial, setQuantidadeInicial] = useState('')
  const [produtoCriado, setProdutoCriado] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function alterarCampo(definirCampo) {
    return (evento) => {
      definirCampo(evento.target.value)
      setSalvo(false)
    }
  }

  async function salvarProduto(dados) {
    if (produto) return editarProduto(produto.id, dados)
    if (produtoCriado) return produtoCriado
    const criado = await cadastrarProduto(dados)
    setProdutoCriado(criado)
    aoCriar?.(criado)
    return criado
  }

  async function registrarEstoqueInicial(produtoSalvo) {
    const quantidade = lerNumero(quantidadeInicial)
    if (produto || !(quantidade > 0)) return
    await registrarMovimentacao({
      produto_id: produtoSalvo.id,
      tipo: 'entrada',
      quantidade,
      observacao: 'Estoque inicial',
    })
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    const dados = {
      nome,
      categoria: categoria.trim() || null,
      unidade_medida: unidade.trim() || null,
      quantidade_minima: lerNumero(minimo),
    }
    try {
      const produtoSalvo = await salvarProduto(dados)
      await registrarEstoqueInicial(produtoSalvo)
      setSalvo(true)
      aoSalvar(produtoSalvo)
    } catch (erro) {
      const camposComErro = erro.campos ?? {}
      setErrosDosCampos(camposComErro)
      setMensagemDeErro(Object.keys(camposComErro).length > 0 ? '' : erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={enviarFormulario}>
      <CampoDeTexto
        id="produto-nome"
        rotulo="Nome"
        required
        autoComplete="off"
        value={nome}
        erro={errosDosCampos.nome?.[0]}
        onChange={alterarCampo(setNome)}
      />
      <div className="formulario-dupla">
        <CampoDeTexto
          id="produto-categoria"
          rotulo="Categoria"
          autoComplete="off"
          value={categoria}
          erro={errosDosCampos.categoria?.[0]}
          onChange={alterarCampo(setCategoria)}
        />
        <CampoDeSelecao
          id="produto-unidade"
          rotulo="Unidade"
          value={unidade}
          erro={errosDosCampos.unidade_medida?.[0]}
          onChange={alterarCampo(setUnidade)}
        >
          <option value="">Selecione</option>
          {unidadesComAtual(produto?.unidade_medida).map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </CampoDeSelecao>
      </div>
      <CampoDeTexto
        id="produto-minimo"
        rotulo="Quantidade mínima"
        inputMode="decimal"
        autoComplete="off"
        value={minimo}
        erro={errosDosCampos.quantidade_minima?.[0]}
        onChange={alterarCampo(setMinimo)}
      />
      {!produto && (
        <CampoDeTexto
          id="produto-quantidade-inicial"
          rotulo="Quantidade inicial"
          inputMode="decimal"
          autoComplete="off"
          value={quantidadeInicial}
          erro={errosDosCampos.quantidade?.[0]}
          onChange={alterarCampo(setQuantidadeInicial)}
        />
      )}

      {produto && (
        <div className="formulario-leitura">
          <span className="campo-rotulo">Saldo atual</span>
          <span className="formulario-valor">
            {formatarQuantidade(produto.quantidade_atual)}
            {produto.unidade_medida && ` ${produto.unidade_medida}`}
          </span>
        </div>
      )}

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Salvando' : 'Salvar'}
        </button>
        {salvo && (
          <span className="formulario-salvo" role="status">
            Salvo
          </span>
        )}
      </div>
    </form>
  )
}
