import { useState } from 'react'

import { cadastrarServico, editarServico } from '../api/servicos.js'
import { lerNumero } from '../formatacao/numero.js'
import CampoDeTexto from './CampoDeTexto.jsx'

export default function FormularioServico({ servico, aoSalvar }) {
  const [nome, setNome] = useState(servico?.nome ?? '')
  const [descricao, setDescricao] = useState(servico?.descricao ?? '')
  const [preco, setPreco] = useState(servico ? servico.preco.toFixed(2).replace('.', ',') : '')
  const [duracao, setDuracao] = useState(servico ? String(servico.duracao_minutos) : '')
  const [ativo, setAtivo] = useState(servico?.ativo ?? true)
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

  function alterarAtivo(evento) {
    setAtivo(evento.target.checked)
    setSalvo(false)
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    const dados = {
      nome,
      descricao: descricao.trim() || null,
      preco: lerNumero(preco),
      duracao_minutos: lerNumero(duracao),
      ativo,
    }
    try {
      const servicoSalvo = servico
        ? await editarServico(servico.id, dados)
        : await cadastrarServico(dados)
      setSalvo(true)
      aoSalvar(servicoSalvo)
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
        id="servico-nome"
        rotulo="Nome"
        required
        autoComplete="off"
        value={nome}
        erro={errosDosCampos.nome?.[0]}
        onChange={alterarCampo(setNome)}
      />
      <CampoDeTexto
        id="servico-descricao"
        rotulo="Descrição"
        autoComplete="off"
        value={descricao}
        erro={errosDosCampos.descricao?.[0]}
        onChange={alterarCampo(setDescricao)}
      />
      <div className="formulario-dupla">
        <CampoDeTexto
          id="servico-preco"
          rotulo="Preço (R$)"
          inputMode="decimal"
          required
          autoComplete="off"
          value={preco}
          erro={errosDosCampos.preco?.[0]}
          onChange={alterarCampo(setPreco)}
        />
        <CampoDeTexto
          id="servico-duracao"
          rotulo="Duração (min)"
          type="number"
          min="1"
          required
          autoComplete="off"
          value={duracao}
          erro={errosDosCampos.duracao_minutos?.[0]}
          onChange={alterarCampo(setDuracao)}
        />
      </div>
      <label className="campo-caixa">
        <input type="checkbox" checked={ativo} onChange={alterarAtivo} />
        Ativo
      </label>

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
