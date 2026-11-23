import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { listarClientes } from '../api/clientes.js'
import CampoDeTexto from './CampoDeTexto.jsx'
import DialogoDeNovoCliente from './DialogoDeNovoCliente.jsx'
import './SeletorDeCliente.css'

const ESPERA_DA_BUSCA_EM_MS = 300

export default function SeletorDeCliente({ cliente, erro, aoSelecionar }) {
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [cadastrando, setCadastrando] = useState(false)
  const termo = busca.trim()
  const termoEhTelefone = /^[\d\s()+-]+$/.test(termo)

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
      return (
        <div className="cliente-resultado-estado">
          <p className="texto-apoio">Nenhum cliente encontrado</p>
          <button type="button" className="botao-secundario" onClick={() => setCadastrando(true)}>
            Cadastrar cliente
          </button>
        </div>
      )
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
        type="text"
        inputMode="search"
        enterKeyHint="search"
        placeholder="Nome ou telefone"
        autoComplete="off"
        value={busca}
        erro={erro}
        onChange={(evento) => setBusca(evento.target.value)}
      />
      {resultadosDaBusca()}
      {cadastrando &&
        createPortal(
          <DialogoDeNovoCliente
            nomeInicial={termoEhTelefone ? '' : termo}
            telefoneInicial={termoEhTelefone ? termo : ''}
            aoCadastrar={(cadastrado) => {
              setCadastrando(false)
              escolherCliente(cadastrado)
            }}
            aoFechar={() => setCadastrando(false)}
          />,
          document.body,
        )}
    </div>
  )
}
