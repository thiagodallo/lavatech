import './ArquiteturaDoSistema.css'

const camadas = [
  {
    nome: 'Interface',
    itens: ['React 19 e Vite', 'Rotas protegidas por sessão', 'CSS por componente, com tokens'],
  },
  {
    nome: 'API',
    itens: ['Node e Express', 'Validação de entrada com zod', 'Rotas, serviços e repositórios'],
  },
  {
    nome: 'Banco',
    itens: ['PostgreSQL', 'Migrations em SQL, versionadas', 'Histórico de status de cada atendimento'],
  },
]

export default function ArquiteturaDoSistema() {
  return (
    <ul className="arquitetura">
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
  )
}
