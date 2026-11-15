import { useState } from 'react'

import { cadastrarVeiculo, editarVeiculo } from '../api/clientes.js'
import { camposIniciaisDoVeiculo, dadosDoVeiculo } from '../dominio/camposDoVeiculo.js'
import CamposDoVeiculo from './CamposDoVeiculo.jsx'

export default function FormularioDeVeiculo({ clienteId, veiculo, aoSalvar, aoCancelar }) {
  const [campos, setCampos] = useState(() => camposIniciaisDoVeiculo(veiculo))
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [versao, setVersao] = useState(0)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setEnviando(true)
    try {
      const dados = dadosDoVeiculo(campos)
      const salvo = veiculo ? await editarVeiculo(clienteId, veiculo.id, dados) : await cadastrarVeiculo(clienteId, dados)
      aoSalvar(salvo)
      if (!veiculo) {
        setCampos(camposIniciaisDoVeiculo(null))
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
      <CamposDoVeiculo
        campos={campos}
        aoMudar={(novos) => setCampos((atuais) => ({ ...atuais, ...novos }))}
        erros={errosDosCampos}
        versao={versao}
      />

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
