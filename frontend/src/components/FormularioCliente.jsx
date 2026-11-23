import { useState } from 'react'

import { cadastrarCliente, cadastrarVeiculo, editarCliente } from '../api/clientes.js'
import { camposIniciaisDoVeiculo, dadosDoVeiculo, veiculoPreenchido } from '../dominio/camposDoVeiculo.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import CamposDoVeiculo from './CamposDoVeiculo.jsx'

export default function FormularioCliente({ cliente, nomeInicial = '', telefoneInicial = '', exigirVeiculo = false, aoSalvar, aoCriar }) {
  const [nome, setNome] = useState(cliente?.nome ?? nomeInicial)
  const [telefone, setTelefone] = useState(cliente?.telefone ?? telefoneInicial)
  const [veiculo, setVeiculo] = useState(() => camposIniciaisDoVeiculo(null))
  const [clienteCriado, setClienteCriado] = useState(null)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const novoCliente = !cliente

  function alterarCampo(definirCampo) {
    return (evento) => {
      definirCampo(evento.target.value)
      setSalvo(false)
    }
  }

  async function salvarCliente() {
    if (cliente) return editarCliente(cliente.id, { nome, telefone })
    if (clienteCriado) return clienteCriado
    const criado = await cadastrarCliente({ nome, telefone })
    setClienteCriado(criado)
    aoCriar?.(criado)
    return criado
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    evento.stopPropagation()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    try {
      const clienteSalvo = await salvarCliente()
      if (novoCliente && veiculoPreenchido(veiculo)) {
        await cadastrarVeiculo(clienteSalvo.id, dadosDoVeiculo(veiculo))
      }
      setSalvo(true)
      aoSalvar(clienteSalvo)
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
        id="cliente-nome"
        rotulo="Nome"
        required
        autoComplete="off"
        value={nome}
        disabled={Boolean(clienteCriado)}
        erro={errosDosCampos.nome?.[0]}
        onChange={alterarCampo(setNome)}
      />
      <CampoDeTexto
        id="cliente-telefone"
        rotulo="Telefone"
        type="tel"
        inputMode="tel"
        required
        autoComplete="off"
        value={telefone}
        disabled={Boolean(clienteCriado)}
        erro={errosDosCampos.telefone?.[0]}
        onChange={alterarCampo(setTelefone)}
      />

      {novoCliente && (
        <>
          <h3 className="formulario-secao">Veículo</h3>
          <CamposDoVeiculo
            campos={veiculo}
            aoMudar={(novos) => setVeiculo((atuais) => ({ ...atuais, ...novos }))}
            erros={errosDosCampos}
            placaObrigatoria={exigirVeiculo}
          />
        </>
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
