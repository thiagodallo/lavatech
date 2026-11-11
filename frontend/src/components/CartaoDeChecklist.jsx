import { horaDoTexto } from '../formatacao/horario.js'
import ChipsDeItens from './ChipsDeItens.jsx'
import PilulaDeResultado from './PilulaDeResultado.jsx'
import './CartaoDeChecklist.css'

export default function CartaoDeChecklist({ checklist }) {
  const { agendamento } = checklist

  return (
    <li className="cartao-checklist">
      <div className="cartao-checklist-corpo">
        <span className="cartao-checklist-hora">
          {checklist.hora_fim ? horaDoTexto(checklist.hora_fim) : ''}
        </span>
        <span className="cartao-checklist-dados">
          <span className="cartao-checklist-cliente">{agendamento.cliente.nome}</span>
          <span className="cartao-checklist-veiculo">
            {agendamento.veiculo.modelo}
            <span className="placa">{agendamento.veiculo.placa}</span>
          </span>
          <span className="cartao-checklist-servico">
            {agendamento.servico.nome} · {checklist.funcionario.nome}
          </span>
          <ChipsDeItens campos={checklist.itens_nao_conformes} />
        </span>
        <span className="cartao-checklist-selos">
          <PilulaDeResultado resultado={checklist.resultado} />
          {checklist.necessita_retrabalho && <span className="selo-retrabalho">Retrabalho</span>}
        </span>
      </div>
    </li>
  )
}
