import { Check } from 'lucide-react'

import { itensDoChecklist } from '../dominio/checklistDeQualidade.js'
import { formasDePagamento } from '../dominio/formasDePagamento.js'
import PilulaDeStatus from './PilulaDeStatus.jsx'
import './TelasDoFluxo.css'

const horarios = [
  { hora: '12:00', ocupado: true },
  { hora: '12:30', ocupado: true },
  { hora: '13:00', escolhido: true },
  { hora: '13:30' },
  { hora: '14:00', ocupado: true },
  { hora: '14:30', ocupado: true },
  { hora: '15:00', ocupado: true },
  { hora: '15:30', ocupado: true },
  { hora: '16:00', ocupado: true },
  { hora: '16:30', ocupado: true },
  { hora: '17:00' },
  { hora: '17:30' },
]

export function TelaDeHorarios() {
  return (
    <div className="tela-fluxo">
      <h3 className="tela-fluxo-titulo">Novo agendamento</h3>
      <dl className="tela-fluxo-dados">
        <div>
          <dt>Cliente</dt>
          <dd>Renata Alves</dd>
        </div>
        <div>
          <dt>Veículo</dt>
          <dd>Fox, KLM4B90</dd>
        </div>
        <div>
          <dt>Serviço</dt>
          <dd>Lavagem simples, 40 min</dd>
        </div>
        <div>
          <dt>Vaga</dt>
          <dd>Vaga 1</dd>
        </div>
      </dl>
      <div className="tela-fluxo-horarios">
        {horarios.map((horario) => (
          <span
            key={horario.hora}
            className={`tela-fluxo-horario${horario.escolhido ? ' tela-fluxo-horario-escolhido' : ''}${
              horario.ocupado ? ' tela-fluxo-horario-ocupado' : ''
            }`}
          >
            {horario.hora}
          </span>
        ))}
      </div>
    </div>
  )
}

export function TelaDeAtendimento() {
  return (
    <div className="tela-fluxo">
      <h3 className="tela-fluxo-titulo">Atendimento</h3>
      <div className="tela-fluxo-cabecalho">
        <span className="tela-fluxo-placa">RKT2H90</span>
        <PilulaDeStatus status="em_andamento" />
      </div>
      <dl className="tela-fluxo-dados">
        <div>
          <dt>Veículo</dt>
          <dd>Compass</dd>
        </div>
        <div>
          <dt>Serviço</dt>
          <dd>Higienização interna</dd>
        </div>
        <div>
          <dt>Vaga</dt>
          <dd>Vaga 1</dd>
        </div>
        <div>
          <dt>Iniciado</dt>
          <dd>10:32</dd>
        </div>
      </dl>
      <div className="tela-fluxo-servicos">
        <span>Higienização interna</span>
        <span>150 min</span>
        <span>R$ 250,00</span>
      </div>
      <ol className="tela-fluxo-historico">
        <li>
          <PilulaDeStatus status="agendado" />
          <span>10:05</span>
        </li>
        <li>
          <PilulaDeStatus status="em_andamento" />
          <span>10:32</span>
        </li>
      </ol>
      <div className="tela-fluxo-acoes">
        <span className="tela-fluxo-botao tela-fluxo-botao-principal">Concluir</span>
        <span className="tela-fluxo-botao">Cancelar</span>
      </div>
    </div>
  )
}

export function TelaDoChecklist() {
  return (
    <div className="tela-fluxo">
      <h3 className="tela-fluxo-titulo">Checklist de qualidade</h3>
      <ul className="tela-fluxo-itens">
        {itensDoChecklist.map((item, indice) => (
          <li key={item.campo} style={{ '--ordem': indice }}>
            <span className="tela-fluxo-marca">
              <Check size={16} strokeWidth={2.5} aria-hidden="true" />
            </span>
            {item.rotuloCurto}
          </li>
        ))}
      </ul>
      <p className="tela-fluxo-resumo">8 de 8 itens conformes</p>
    </div>
  )
}

export function TelaDePagamento() {
  return (
    <div className="tela-fluxo">
      <h3 className="tela-fluxo-titulo">Pagamento</h3>
      <dl className="tela-fluxo-dados">
        <div>
          <dt>Veículo</dt>
          <dd>Compass, RKT2H90</dd>
        </div>
        <div>
          <dt>Serviço</dt>
          <dd>Higienização interna</dd>
        </div>
      </dl>
      <p className="tela-fluxo-total">R$ 250,00</p>
      <div className="tela-fluxo-formas">
        {formasDePagamento.map((forma) => (
          <span
            key={forma.valor}
            className={`tela-fluxo-forma${forma.valor === 'pix' ? ' tela-fluxo-forma-escolhida' : ''}`}
          >
            {forma.rotulo}
          </span>
        ))}
      </div>
      <div className="tela-fluxo-acoes">
        <span className="tela-fluxo-botao tela-fluxo-botao-principal">Registrar pagamento</span>
      </div>
    </div>
  )
}
