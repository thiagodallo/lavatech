import { useEffect, useState } from 'react'

import { listarServicos } from '../api/servicos.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import './Catalogo.css'

export default function Catalogo() {
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

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
          <li key={servico.id} className={servico.ativo ? 'servico' : 'servico servico-inativo'}>
            <div className="servico-dados">
              <span className="servico-nome">{servico.nome}</span>
              <span className="servico-duracao">{servico.duracao_minutos} min</span>
              {!servico.ativo && <span className="servico-selo">Inativo</span>}
            </div>
            <span className="servico-preco">{formatarMoeda(servico.preco)}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="catalogo-cabecalho">
        <h1 className="titulo-tela">Catálogo de serviços</h1>
      </header>

      {corpoDaLista()}
    </section>
  )
}
