import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listarClientes } from '../api/clientes.js'
import './Clientes.css'

const ESPERA_DA_BUSCA_EM_MS = 300

export default function Clientes() {
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarClientes() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarClientes(busca.trim())
        if (atual) setClientes(encontrados)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    const espera = setTimeout(carregarClientes, busca ? ESPERA_DA_BUSCA_EM_MS : 0)
    return () => {
      atual = false
      clearTimeout(espera)
    }
  }, [busca, tentativa])

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="clientes-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && clientes.length === 0) {
      return (
        <p className="clientes-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (clientes.length === 0) {
      return (
        <p className="clientes-estado texto-apoio">
          {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
        </p>
      )
    }

    return (
      <ul className="clientes-itens">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="cliente-linha">
            <span className="cliente-nome">{cliente.nome}</span>
            <span className="cliente-placas">
              {cliente.veiculos.map((veiculo) => (
                <span key={veiculo.id} className="placa">
                  {veiculo.placa}
                </span>
              ))}
            </span>
            <span className="cliente-telefone">{cliente.telefone}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="clientes-cabecalho">
        <h1 className="titulo-tela">Clientes</h1>
        <label className="clientes-busca">
          <Search size={14} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar cliente"
            aria-label="Buscar cliente"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </label>
      </header>

      <div className="clientes-lista">{corpoDaLista()}</div>
    </section>
  )
}
