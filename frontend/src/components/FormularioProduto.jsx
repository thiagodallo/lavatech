import { useState } from 'react'

import { cadastrarProduto, editarProduto } from '../api/produtos.js'
import { lerNumero } from '../formatacao/numero.js'
import { formatarQuantidade } from '../formatacao/quantidade.js'
import CampoDeTexto from './CampoDeTexto.jsx'

export default function FormularioProduto({ produto, aoSalvar }) {
  const [nome, setNome] = useState(produto?.nome ?? '')
  const [categoria, setCategoria] = useState(produto?.categoria ?? '')
  const [unidade, setUnidade] = useState(produto?.unidade_medida ?? '')
  const [minimo, setMinimo] = useState(produto ? String(produto.quantidade_minima).replace('.', ',') : '')
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
      const produtoSalvo = produto
        ? await editarProduto(produto.id, dados)
        : await cadastrarProduto(dados)
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
        <CampoDeTexto
          id="produto-unidade"
          rotulo="Unidade"
          autoComplete="off"
          value={unidade}
          erro={errosDosCampos.unidade_medida?.[0]}
          onChange={alterarCampo(setUnidade)}
        />
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
