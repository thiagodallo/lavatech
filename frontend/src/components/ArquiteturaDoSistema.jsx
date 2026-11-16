import usarEntradaNaTela from '../hooks/usarEntradaNaTela.js'
import './ArquiteturaDoSistema.css'

const camadas = [
  {
    nome: 'Interface',
    itens: ['React 19 e Vite', 'Rotas protegidas por sessão', 'CSS por componente, com tokens'],
    passo: 'POST /api/agendamentos',
  },
  {
    nome: 'API',
    itens: ['Node e Express', 'Validação de entrada com zod', 'Rotas, serviços e repositórios'],
    passo: 'Valida a entrada e confere vaga e horário',
  },
  {
    nome: 'Banco',
    itens: ['PostgreSQL', 'Migrations em SQL, versionadas', 'Histórico de status de cada atendimento'],
    passo: 'Grava o agendamento e o histórico de status',
  },
]

export default function ArquiteturaDoSistema() {
  const [referencia, entrou] = usarEntradaNaTela()

  return (
    <div ref={referencia} className={`arquitetura${entrou ? ' arquitetura-ativa' : ''}`}>
      <ul className="arquitetura-camadas">
        {camadas.map((camada) => (
          <li key={camada.nome} className="arquitetura-camada">
            <h3 className="arquitetura-nome">{camada.nome}</h3>
            <ul className="arquitetura-itens">
              {camada.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="arquitetura-trajeto" aria-hidden="true">
        <span className="arquitetura-pulso" />
      </div>

      <ol className="arquitetura-passos">
        {camadas.map((camada, indice) => (
          <li key={camada.nome} className="arquitetura-passo" style={{ '--passo': indice }}>
            {camada.passo}
          </li>
        ))}
      </ol>
    </div>
  )
}
