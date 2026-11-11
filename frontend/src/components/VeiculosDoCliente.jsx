import { useState } from 'react'

import { cadastrarVeiculo } from '../api/clientes.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import './VeiculosDoCliente.css'

function descreverVeiculo({ marca, modelo, cor }) {
  const nomeDoCarro = [marca, modelo].filter(Boolean).join(' ')
  return [nomeDoCarro, cor].filter(Boolean).join(' · ')
}

export default function VeiculosDoCliente({ clienteId, veiculos, aoCadastrar }) {
  const [placa, setPlaca] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [cor, setCor] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErrosDosCampos({})
    setEnviando(true)

    const dados = {
      placa,
      marca: marca.trim() || null,
      modelo: modelo.trim() || null,
      cor: cor.trim() || null,
    }
    try {
      const veiculoCadastrado = await cadastrarVeiculo(clienteId, dados)
      aoCadastrar(veiculoCadastrado)
      setPlaca('')
      setMarca('')
      setModelo('')
      setCor('')
    } catch (erro) {
      const camposComErro = erro.campos ?? {}
      setErrosDosCampos(camposComErro)
      setMensagemDeErro(Object.keys(camposComErro).length > 0 ? '' : erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="veiculos" aria-labelledby="veiculos-titulo">
      <h3 className="veiculos-titulo" id="veiculos-titulo">
        Veículos
      </h3>

      {veiculos.length === 0 ? (
        <p className="texto-apoio">Nenhum veículo</p>
      ) : (
        <ul className="veiculos-lista">
          {veiculos.map((veiculo) => (
            <li key={veiculo.id} className="veiculo-item">
              <span className="placa">{veiculo.placa}</span>
              <span className="veiculo-descricao">{descreverVeiculo(veiculo)}</span>
            </li>
          ))}
        </ul>
      )}

      <form className="formulario" onSubmit={enviarFormulario}>
        <div className="veiculos-campos">
          <CampoDeTexto
            id="veiculo-placa"
            rotulo="Placa"
            required
            maxLength={8}
            autoComplete="off"
            value={placa}
            erro={errosDosCampos.placa?.[0]}
            onChange={(evento) => setPlaca(evento.target.value)}
          />
          <CampoDeTexto
            id="veiculo-marca"
            rotulo="Marca"
            autoComplete="off"
            value={marca}
            erro={errosDosCampos.marca?.[0]}
            onChange={(evento) => setMarca(evento.target.value)}
          />
          <CampoDeTexto
            id="veiculo-modelo"
            rotulo="Modelo"
            autoComplete="off"
            value={modelo}
            erro={errosDosCampos.modelo?.[0]}
            onChange={(evento) => setModelo(evento.target.value)}
          />
          <CampoDeTexto
            id="veiculo-cor"
            rotulo="Cor"
            autoComplete="off"
            value={cor}
            erro={errosDosCampos.cor?.[0]}
            onChange={(evento) => setCor(evento.target.value)}
          />
        </div>

        {mensagemDeErro && (
          <p className="formulario-erro" role="alert">
            {mensagemDeErro}
          </p>
        )}

        <div className="formulario-acoes">
          <button type="submit" className="botao-secundario" disabled={enviando}>
            {enviando ? 'Adicionando' : 'Adicionar veículo'}
          </button>
        </div>
      </form>
    </section>
  )
}
