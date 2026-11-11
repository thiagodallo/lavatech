import { horaDoTexto } from '../formatacao/horario.js'
import ChipsDeItens from './ChipsDeItens.jsx'
import LinhaDeServicos from './LinhaDeServicos.jsx'
import PilulaDeResultado from './PilulaDeResultado.jsx'
import './CartaoDeChecklist.css'

function DadosDoCartao({ checklist }) {
  const { agendamento } = checklist

  return (
    <span className="cartao-checklist-dados">
      <span className="cartao-checklist-cliente">{agendamento.cliente.nome}</span>
      <span className="cartao-checklist-veiculo">
        {agendamento.veiculo.modelo}
        <span className="placa">{agendamento.veiculo.placa}</span>
      </span>
      <LinhaDeServicos
        servicos={agendamento.servicos}
        complemento={checklist.funcionario.nome}
        className="cartao-checklist-servico"
      />
      <ChipsDeItens campos={checklist.itens_nao_conformes} />
    </span>
  )
}

function SelosDoCartao({ checklist }) {
  return (
    <span className="cartao-checklist-selos">
      <PilulaDeResultado resultado={checklist.resultado} />
      {checklist.necessita_retrabalho && <span className="selo-retrabalho">Retrabalho</span>}
    </span>
  )
}

export default function CartaoDeChecklist({ checklist, selecionado, aoAbrir }) {
  return (
    <li className="cartao-checklist">
      <button
        type="button"
        className="cartao-checklist-corpo"
        aria-current={selecionado ? 'true' : undefined}
        onClick={aoAbrir}
      >
        <span className="cartao-checklist-hora">{checklist.hora_fim ? horaDoTexto(checklist.hora_fim) : ''}</span>
        <DadosDoCartao checklist={checklist} />
        <SelosDoCartao checklist={checklist} />
      </button>
    </li>
  )
}
