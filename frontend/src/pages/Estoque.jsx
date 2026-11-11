import { AlertTriangle, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listarProdutos } from '../api/produtos.js'
import FormularioProduto from '../components/FormularioProduto.jsx'
import PainelLateral from '../components/PainelLateral.jsx'
import SecaoDeMovimentacao from '../components/SecaoDeMovimentacao.jsx'
import { formatarQuantidade } from '../formatacao/quantidade.js'
import './Estoque.css'

export default function Estoque() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [painel, setPainel] = useState(null)

  useEffect(() => {
    let atual = true

    async function carregarProdutos() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarProdutos()
        if (atual) setProdutos(encontrados)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarProdutos()
    return () => {
      atual = false
    }
  }, [tentativa])

  function aoSalvarProduto(produto) {
    setPainel({ produto })
    setTentativa((anterior) => anterior + 1)
  }

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="estoque-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && produtos.length === 0) {
      return (
        <p className="estoque-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (produtos.length === 0) {
      return <p className="estoque-estado texto-apoio">Nenhum produto cadastrado</p>
    }

    return (
      <ul className="estoque-itens">
        {produtos.map((produto) => {
          const abaixoDoMinimo = produto.quantidade_atual < produto.quantidade_minima
          return (
            <li key={produto.id} className="produto-item">
              <button
                type="button"
                className="produto-linha"
                aria-current={painel?.produto?.id === produto.id ? 'true' : undefined}
                onClick={() => setPainel({ produto })}
              >
                <div className="produto-dados">
                  <span className="produto-nome">{produto.nome}</span>
                  {produto.categoria && <span className="produto-categoria">{produto.categoria}</span>}
                </div>
                <span className="produto-saldo">
                  {formatarQuantidade(produto.quantidade_atual)} / mín. {formatarQuantidade(produto.quantidade_minima)}
                  {produto.unidade_medida && ` ${produto.unidade_medida}`}
                </span>
                {abaixoDoMinimo ? (
                  <span className="selo-estoque selo-repor">
                    <AlertTriangle size={12} aria-hidden="true" />
                    Repor
                  </span>
                ) : (
                  <span className="selo-estoque selo-ok">OK</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <section>
      <header className="estoque-cabecalho">
        <h1 className="titulo-tela">Controle de estoque</h1>
        <button type="button" className="botao-primario" onClick={() => setPainel({ produto: null })}>
          <Plus size={16} aria-hidden="true" />
          Novo produto
        </button>
      </header>

      <div className={painel ? 'area-com-painel painel-aberto' : 'area-com-painel'}>
        <div className="estoque-lista">{corpoDaLista()}</div>

        {painel && (
          <PainelLateral
            titulo={painel.produto ? 'Editar produto' : 'Novo produto'}
            aoFechar={() => setPainel(null)}
          >
            <FormularioProduto
              key={painel.produto?.id ?? 'novo'}
              produto={painel.produto}
              aoSalvar={aoSalvarProduto}
            />
            {painel.produto && (
              <SecaoDeMovimentacao key={`movimentacao-${painel.produto.id}`} produto={painel.produto} />
            )}
          </PainelLateral>
        )}
      </div>
    </section>
  )
}
