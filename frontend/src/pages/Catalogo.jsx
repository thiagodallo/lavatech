import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listarServicos } from '../api/servicos.js'
import FormularioServico from '../components/FormularioServico.jsx'
import PainelLateral from '../components/PainelLateral.jsx'
import { formatarMoeda } from '../formatacao/moeda.js'
import './Catalogo.css'

export default function Catalogo() {
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [painel, setPainel] = useState(null)

  useEffect(() => {
    let atual = true

    async function carregarServicos() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarServicos()
        if (atual) setServicos(encontrados)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarServicos()
    return () => {
      atual = false
    }
  }, [tentativa])

  function aoSalvarServico(servico) {
    setPainel({ servico })
    setTentativa((anterior) => anterior + 1)
  }

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="catalogo-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && servicos.length === 0) {
      return (
        <p className="catalogo-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (servicos.length === 0) {
      return <p className="catalogo-estado texto-apoio">Nenhum serviço cadastrado</p>
    }

    return (
      <ul className="catalogo-itens">
        {servicos.map((servico) => (
          <li key={servico.id}>
            <button
              type="button"
              className={servico.ativo ? 'servico' : 'servico servico-inativo'}
              aria-current={painel?.servico?.id === servico.id ? 'true' : undefined}
              onClick={() => setPainel({ servico })}
            >
              <div className="servico-dados">
                <span className="servico-nome">{servico.nome}</span>
                <span className="servico-duracao">{servico.duracao_minutos} min</span>
                {!servico.ativo && <span className="servico-selo">Inativo</span>}
              </div>
              <span className="servico-preco">{formatarMoeda(servico.preco)}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="catalogo-cabecalho">
        <h1 className="titulo-tela">Catálogo de serviços</h1>
        <button type="button" className="botao-primario" onClick={() => setPainel({ servico: null })}>
          <Plus size={16} aria-hidden="true" />
          Novo serviço
        </button>
      </header>

      <div className={painel ? 'area-com-painel painel-aberto' : 'area-com-painel'}>
        <div>{corpoDaLista()}</div>

        {painel && (
          <PainelLateral
            titulo={painel.servico ? 'Editar serviço' : 'Novo serviço'}
            aoFechar={() => setPainel(null)}
          >
            <FormularioServico
              key={painel.servico?.id ?? 'novo'}
              servico={painel.servico}
              aoSalvar={aoSalvarServico}
            />
          </PainelLateral>
        )}
      </div>
    </section>
  )
}
