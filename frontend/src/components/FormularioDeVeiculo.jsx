import { useState } from 'react'

import { cadastrarVeiculo, editarVeiculo } from '../api/clientes.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import CamposDeMarcaEModelo from './CamposDeMarcaEModelo.jsx'

function camposIniciais(veiculo) {
  return {
    placa: veiculo?.placa ?? '',
    marca: veiculo?.marca ?? '',
    modelo: veiculo?.modelo ?? '',
    cor: veiculo?.cor ?? '',
  }
}

function dadosParaEnviar(campos) {
  return {
    placa: campos.placa,
    marca: campos.marca.trim() || null,
    modelo: campos.modelo.trim() || null,
    cor: campos.cor.trim() || null,
  }
}

export default function FormularioDeVeiculo({ clienteId, veiculo, aoSalvar, aoCancelar }) {
  const [campos, setCampos] = useState(() => camposIniciais(veiculo))
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [versao, setVersao] = useState(0)

  function alterar(campo) {
    return (evento) => setCampos((atuais) => ({ ...atuais, [campo]: evento.target.value }))
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setEnviando(true)
    try {
      const dados = dadosParaEnviar(campos)
      const salvo = veiculo ? await editarVeiculo(clienteId, veiculo.id, dados) : await cadastrarVeiculo(clienteId, dados)
      aoSalvar(salvo)
      if (!veiculo) {
        setCampos(camposIniciais(null))
        setVersao((anterior) => anterior + 1)
      }
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
      <div className="veiculos-campos">
        <CampoDeTexto
          id="veiculo-placa"
          rotulo="Placa"
          required
          maxLength={8}
          autoComplete="off"
          value={campos.placa}
          erro={errosDosCampos.placa?.[0]}
          onChange={alterar('placa')}
        />
        <CampoDeTexto
          id="veiculo-cor"
          rotulo="Cor"
          autoComplete="off"
          value={campos.cor}
          erro={errosDosCampos.cor?.[0]}
          onChange={alterar('cor')}
        />
        <CamposDeMarcaEModelo
          key={versao}
          marca={campos.marca}
          modelo={campos.modelo}
          erros={errosDosCampos}
          aoMudar={(novos) => setCampos((atuais) => ({ ...atuais, ...novos }))}
        />
      </div>

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className={veiculo ? 'botao-primario' : 'botao-secundario'} disabled={enviando}>
          {veiculo ? 'Salvar veículo' : 'Adicionar veículo'}
        </button>
        {veiculo && (
          <button type="button" className="botao-secundario" onClick={aoCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
