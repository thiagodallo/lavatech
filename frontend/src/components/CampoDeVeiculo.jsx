import { Link } from 'react-router'

import CampoDeSelecao from './CampoDeSelecao.jsx'

function CampoDeVeiculoBloqueado() {
  return (
    <CampoDeSelecao id="agendamento-veiculo" rotulo="Veículo" disabled>
      <option value="">Selecione um cliente primeiro</option>
    </CampoDeSelecao>
  )
}

function AvisoSemVeiculo() {
  return (
    <p className="formulario-aviso" role="status">
      Este cliente não tem veículo. Cadastre na tela <Link to="/clientes">Clientes</Link>.
    </p>
  )
}

export default function CampoDeVeiculo({ cliente, valor, erro, aoMudar }) {
  if (!cliente) return <CampoDeVeiculoBloqueado />
  if (cliente.veiculos.length === 0) return <AvisoSemVeiculo />

  return (
    <CampoDeSelecao
      id="agendamento-veiculo"
      rotulo="Veículo"
      required
      value={valor}
      erro={erro}
      onChange={(evento) => aoMudar(evento.target.value)}
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
