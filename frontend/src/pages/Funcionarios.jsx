import { useEffect, useState } from 'react'

import { listarFuncionarios } from '../api/funcionarios.js'
import { useSessao } from '../contexts/SessaoContext.jsx'
import './Funcionarios.css'

export default function Funcionarios() {
  const { funcionario: logado } = useSessao()
  const [funcionarios, setFuncionarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarFuncionarios() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarFuncionarios()
        if (atual) setFuncionarios(encontrados)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarFuncionarios()
    return () => {
      atual = false
    }
  }, [tentativa])

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="funcionarios-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && funcionarios.length === 0) {
      return (
        <p className="funcionarios-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (funcionarios.length === 0) {
      return <p className="funcionarios-estado texto-apoio">Nenhum funcionário cadastrado</p>
    }

    return (
      <ul className="funcionarios-itens">
        {funcionarios.map((funcionario) => (
          <li
            key={funcionario.id}
            className={funcionario.ativo ? 'funcionario-linha' : 'funcionario-linha funcionario-inativo'}
          >
            <span className="funcionario-nome">
              {funcionario.nome}
              {funcionario.id === logado?.id && <span className="funcionario-selo">Você</span>}
              {!funcionario.ativo && <span className="funcionario-selo">Inativo</span>}
            </span>
            <span className="funcionario-email">{funcionario.email}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="funcionarios-cabecalho">
        <h1 className="titulo-tela">Funcionários</h1>
      </header>

      <div className="funcionarios-lista">{corpoDaLista()}</div>
    </section>
  )
}
