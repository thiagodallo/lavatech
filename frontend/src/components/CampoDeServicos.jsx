import { LIMITE_DE_SERVICOS_POR_AGENDAMENTO, totaisDosServicos } from '../dominio/servicosDoAgendamento.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import TotalDosServicos from './TotalDosServicos.jsx'
import './CampoDeServicos.css'

const ID_DO_ERRO = 'agendamento-servicos-erro'

function OpcaoDeServico({ servico, marcado, bloqueado, aoAlternar }) {
  return (
    <li>
      <label className="opcao-de-servico">
        <input
          type="checkbox"
          checked={marcado}
          disabled={bloqueado}
          onChange={() => aoAlternar(servico.id)}
        />
        <span className="opcao-de-servico-nome">{servico.nome}</span>
        <span className="opcao-de-servico-dados">
          {servico.duracao_minutos} min · {formatarMoeda(servico.preco)}
        </span>
      </label>
    </li>
  )
}

function TotalDosMarcados({ marcados }) {
  if (marcados.length === 0) return null
  const totais = totaisDosServicos(marcados)
  return <TotalDosServicos duracaoMinutos={totais.duracao_minutos} preco={totais.preco} />
}

function ListaDeServicos({ servicos, escolhidos, noLimite, aoAlternar }) {
  return (
    <ul className="campo-de-servicos-lista">
      {servicos.map((servico) => (
        <OpcaoDeServico
          key={servico.id}
          servico={servico}
          marcado={escolhidos.includes(servico.id)}
          bloqueado={noLimite && !escolhidos.includes(servico.id)}
          aoAlternar={aoAlternar}
        />
      ))}
    </ul>
  )
}

export default function CampoDeServicos({ servicos, escolhidos, erro, aoAlternar }) {
  const noLimite = escolhidos.length >= LIMITE_DE_SERVICOS_POR_AGENDAMENTO
  const marcados = servicos.filter((servico) => escolhidos.includes(servico.id))

  return (
    <fieldset className="campo-de-servicos" aria-describedby={erro ? ID_DO_ERRO : undefined}>
      <legend className="campo-rotulo">Serviços</legend>
      <ListaDeServicos servicos={servicos} escolhidos={escolhidos} noLimite={noLimite} aoAlternar={aoAlternar} />
      <TotalDosMarcados marcados={marcados} />
      {noLimite && (
        <p className="campo-de-servicos-limite" role="status">
          Máximo de {LIMITE_DE_SERVICOS_POR_AGENDAMENTO} serviços
        </p>
      )}
      {erro && (
        <p className="campo-erro" id={ID_DO_ERRO}>
          {erro}
        </p>
      )}
    </fieldset>
  )
}
