import { useState } from 'react'
import { Link } from 'react-router'

import CampoDeSelecao from './CampoDeSelecao.jsx'
import SeletorDeCliente from './SeletorDeCliente.jsx'
import './FormularioDeAgendamento.css'

export default function FormularioDeAgendamento() {
  const [cliente, setCliente] = useState(null)
  const [veiculoId, setVeiculoId] = useState('')

  function escolherCliente(escolhido) {
    setCliente(escolhido)
    const unicoVeiculo = escolhido?.veiculos.length === 1 ? escolhido.veiculos[0] : null
    setVeiculoId(unicoVeiculo ? String(unicoVeiculo.id) : '')
  }

  function campoDeVeiculo() {
    if (!cliente) {
      return (
        <CampoDeSelecao id="agendamento-veiculo" rotulo="Veículo" disabled>
          <option value="">Selecione um cliente primeiro</option>
        </CampoDeSelecao>
      )
    }

    if (cliente.veiculos.length === 0) {
      return (
        <p className="formulario-aviso" role="status">
          Este cliente não tem veículo. Cadastre na tela <Link to="/clientes">Clientes</Link>.
        </p>
      )
    }

    return (
      <CampoDeSelecao
        id="agendamento-veiculo"
        rotulo="Veículo"
        required
        value={veiculoId}
        onChange={(evento) => setVeiculoId(evento.target.value)}
      >
        <option value="">Selecione</option>
        {cliente.veiculos.map((veiculo) => (
          <option key={veiculo.id} value={veiculo.id}>
            {veiculo.modelo} · {veiculo.placa}
          </option>
        ))}
      </CampoDeSelecao>
    )
  }

  return (
    <form className="formulario formulario-agendamento" onSubmit={(evento) => evento.preventDefault()}>
      <SeletorDeCliente cliente={cliente} aoSelecionar={escolherCliente} />
      {campoDeVeiculo()}
    </form>
  )
}
