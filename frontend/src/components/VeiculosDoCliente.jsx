import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { removerVeiculo } from '../api/clientes.js'
import FormularioDeVeiculo from './FormularioDeVeiculo.jsx'
import './BotoesDeStatus.css'
import './VeiculosDoCliente.css'

function descreverVeiculo({ marca, modelo, cor }) {
  const nomeDoCarro = [marca, modelo].filter(Boolean).join(' ')
  return [nomeDoCarro, cor].filter(Boolean).join(' | ')
}

function AcoesDoVeiculo({ veiculo, confirmando, ocupado, aoEditar, aoPedirRemocao, aoConfirmar, aoCancelar }) {
  if (confirmando) {
    return (
      <span className="veiculo-acoes">
        <button type="button" className="botao-perigo botao-pequeno" disabled={ocupado} onClick={aoConfirmar}>
          Confirmar remoção
        </button>
        <button type="button" className="botao-secundario botao-pequeno" onClick={aoCancelar}>
          Cancelar
        </button>
      </span>
    )
  }
  return (
    <span className="veiculo-acoes">
      <button type="button" className="veiculo-acao" aria-label={`Editar ${veiculo.placa}`} onClick={aoEditar}>
        <Pencil size={16} aria-hidden="true" />
      </button>
      <button type="button" className="veiculo-acao" aria-label={`Remover ${veiculo.placa}`} onClick={aoPedirRemocao}>
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </span>
  )
}

export default function VeiculosDoCliente({ clienteId, veiculos, aoCadastrar, aoEditar, aoRemover }) {
  const [editandoId, setEditandoId] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [removendo, setRemovendo] = useState(false)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const editando = veiculos.find((veiculo) => veiculo.id === editandoId)

  function comecarEdicao(veiculo) {
    setConfirmandoId(null)
    setMensagemDeErro('')
    setEditandoId(veiculo.id)
  }

  function pedirRemocao(veiculo) {
    setEditandoId(null)
    setMensagemDeErro('')
    setConfirmandoId(veiculo.id)
  }

  function aoSalvarEdicao(veiculo) {
    aoEditar(veiculo)
    setEditandoId(null)
  }

  async function confirmarRemocao(veiculo) {
    setRemovendo(true)
    setMensagemDeErro('')
    try {
      await removerVeiculo(clienteId, veiculo.id)
      aoRemover(veiculo.id)
      setConfirmandoId(null)
    } catch (erro) {
      setMensagemDeErro(erro.message)
      setConfirmandoId(null)
    } finally {
      setRemovendo(false)
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
              <AcoesDoVeiculo
                veiculo={veiculo}
                confirmando={confirmandoId === veiculo.id}
                ocupado={removendo}
                aoEditar={() => comecarEdicao(veiculo)}
                aoPedirRemocao={() => pedirRemocao(veiculo)}
                aoConfirmar={() => confirmarRemocao(veiculo)}
                aoCancelar={() => setConfirmandoId(null)}
              />
            </li>
          ))}
        </ul>
      )}

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <h4 className="veiculos-subtitulo">{editando ? `Editar ${editando.placa}` : 'Novo veículo'}</h4>
      <FormularioDeVeiculo
        key={editando?.id ?? 'novo'}
        clienteId={clienteId}
        veiculo={editando}
        aoSalvar={editando ? aoSalvarEdicao : aoCadastrar}
        aoCancelar={() => setEditandoId(null)}
      />
    </section>
  )
}
