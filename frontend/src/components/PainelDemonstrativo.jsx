import usarContagem from '../hooks/usarContagem.js'
import usarEntradaNaTela from '../hooks/usarEntradaNaTela.js'
import './PainelDemonstrativo.css'

const faturamentoPorDia = [
  { dia: 'Seg', valor: 1240 },
  { dia: 'Ter', valor: 980 },
  { dia: 'Qua', valor: 1520 },
  { dia: 'Qui', valor: 1100 },
  { dia: 'Sex', valor: 1760 },
  { dia: 'Sáb', valor: 2080 },
]

const tempoMedioPorServico = [
  { servico: 'Lavagem simples', minutos: 38 },
  { servico: 'Lavagem completa', minutos: 82 },
  { servico: 'Higienização interna', minutos: 148 },
  { servico: 'Polimento', minutos: 176 },
]

const maiorFaturamento = Math.max(...faturamentoPorDia.map((item) => item.valor))
const maiorTempo = Math.max(...tempoMedioPorServico.map((item) => item.minutos))
const faturamentoTotal = faturamentoPorDia.reduce((soma, item) => soma + item.valor, 0)

function formatarReais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export default function PainelDemonstrativo() {
  const [referencia, entrou] = usarEntradaNaTela()
  const totalExibido = usarContagem(faturamentoTotal, entrou)

  return (
    <div
      ref={referencia}
      className={`painel-demo${entrou ? ' painel-demo-ativo' : ''}`}
      aria-label="Dashboard em demonstração"
    >
      <section className="painel-demo-bloco">
        <h3 className="painel-demo-titulo">Faturamento da semana</h3>
        <p className="painel-demo-total">{formatarReais(totalExibido)}</p>
        <ul className="painel-demo-barras">
          {faturamentoPorDia.map((item, indice) => (
            <li key={item.dia} className="painel-demo-barra" style={{ '--ordem': indice }}>
              <span className="painel-demo-valor">{formatarReais(item.valor)}</span>
              <span
                className="painel-demo-coluna"
                style={{ height: `${(item.valor / maiorFaturamento) * 100}%` }}
              />
              <span className="painel-demo-rotulo">{item.dia}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="painel-demo-bloco">
        <h3 className="painel-demo-titulo">Tempo médio por serviço</h3>
        <ul className="painel-demo-linhas">
          {tempoMedioPorServico.map((item, indice) => (
            <li key={item.servico} className="painel-demo-linha" style={{ '--ordem': indice }}>
              <span>{item.servico}</span>
              <span className="painel-demo-trilho">
                <span
                  className="painel-demo-preenchimento"
                  style={{ width: `${(item.minutos / maiorTempo) * 100}%` }}
                />
              </span>
              <span className="painel-demo-minutos">{item.minutos} min</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="painel-demo-aviso">Dados de demonstração</p>
    </div>
  )
}
