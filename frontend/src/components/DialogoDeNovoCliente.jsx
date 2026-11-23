import { listarClientes } from '../api/clientes.js'
import Dialogo from './Dialogo.jsx'
import FormularioCliente from './FormularioCliente.jsx'

async function clienteComVeiculos(cliente) {
  try {
    const encontrados = await listarClientes(cliente.telefone)
    return encontrados.find((candidato) => candidato.id === cliente.id) ?? { ...cliente, veiculos: [] }
  } catch {
    return { ...cliente, veiculos: [] }
  }
}

export default function DialogoDeNovoCliente({ nomeInicial, telefoneInicial, aoCadastrar, aoFechar }) {
  async function aoSalvar(cliente) {
    aoCadastrar(await clienteComVeiculos(cliente))
  }

  return (
    <Dialogo titulo="Novo cliente" aoFechar={aoFechar}>
      <FormularioCliente
        nomeInicial={nomeInicial}
        telefoneInicial={telefoneInicial}
        exigirVeiculo
        aoSalvar={aoSalvar}
      />
    </Dialogo>
  )
}
