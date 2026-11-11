import { useEffect, useState } from 'react'

import { listarClientes } from '../api/clientes.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import './SeletorDeCliente.css'

const ESPERA_DA_BUSCA_EM_MS = 300

export default function SeletorDeCliente({ cliente, erro, aoSelecionar }) {
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const termo = busca.trim()

  useEffect(() => {
    if (!termo) {
      setResultados([])
      setMensagemDeErro('')
      return undefined
    }

    let atual = true

    async function buscarClientes() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarClientes(termo)
        if (atual) setResultados(encontrados)
      } catch (falha) {
        if (atual) setMensagemDeErro(falha.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    const espera = setTimeout(buscarClientes, ESPERA_DA_BUSCA_EM_MS)
    return () => {
      atual = false
      clearTimeout(espera)
    }
  }, [termo, tentativa])

  function escolherCliente(escolhido) {
    setBusca('')
    aoSelecionar(escolhido)
  }

  function resultadosDaBusca() {
    if (!termo) return null

    if (mensagemDeErro) {
      return (
        <div className="cliente-resultado-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && resultados.length === 0) {
      return (
        <p className="cliente-resultado-estado texto-apoio" role="status">
          Buscando
        </p>
      )
    }

    if (resultados.length === 0) {
      return <p className="cliente-resultado-estado texto-apoio">Nenhum cliente encontrado</p>
    }

    return (
      <ul className="cliente-resultados">
        {resultados.map((resultado) => (
          <li key={resultado.id}>
            <button type="button" className="cliente-resultado" onClick={() => escolherCliente(resultado)}>
              <span className="cliente-resultado-nome">{resultado.nome}</span>
              <span className="cliente-resultado-telefone">{resultado.telefone}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (cliente) {
    return (
      <div className="campo">
        <span className="campo-rotulo">Cliente</span>
        <div className="cliente-escolhido">
          <span className="cliente-resultado-nome">{cliente.nome}</span>
          <span className="cliente-resultado-telefone">{cliente.telefone}</span>
          <button type="button" className="botao-secundario botao-pequeno" onClick={() => aoSelecionar(null)}>
            Trocar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="seletor-de-cliente">
      <CampoDeTexto
        id="agendamento-cliente"
        rotulo="Cliente"
        type="search"
        placeholder="Nome ou telefone"
        autoComplete="off"
        value={busca}
        erro={erro}
        onChange={(evento) => setBusca(evento.target.value)}
      />
      {resultadosDaBusca()}
    </div>
  )
}
