import { useState } from 'react'

import { cadastrarCliente, cadastrarVeiculo, editarCliente } from '../api/clientes.js'
import { camposIniciaisDoVeiculo, dadosDoVeiculo, veiculoPreenchido } from '../dominio/camposDoVeiculo.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import CamposDoVeiculo from './CamposDoVeiculo.jsx'

export default function FormularioCliente({ cliente, aoSalvar }) {
  const [nome, setNome] = useState(cliente?.nome ?? '')
  const [telefone, setTelefone] = useState(cliente?.telefone ?? '')
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
    return clienteCriado ?? cadastrarCliente({ nome, telefone })
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setSalvo(false)
    setEnviando(true)

    try {
      const clienteSalvo = await salvarCliente()
      if (novoCliente) setClienteCriado(clienteSalvo)
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
            placaObrigatoria={false}
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
