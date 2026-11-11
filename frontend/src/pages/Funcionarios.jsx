import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listarFuncionarios } from '../api/funcionarios.js'
import FormularioFuncionario from '../components/FormularioFuncionario.jsx'
import PainelLateral from '../components/PainelLateral.jsx'
import { useSessao } from '../contexts/SessaoContext.jsx'
import './Funcionarios.css'

export default function Funcionarios() {
  const { funcionario: logado, atualizarFuncionario } = useSessao()
  const [funcionarios, setFuncionarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [painel, setPainel] = useState(null)

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

  function aoSalvarFuncionario(funcionario) {
    if (funcionario.id === logado?.id) atualizarFuncionario(funcionario)
    setPainel({ funcionario })
    setTentativa((anterior) => anterior + 1)
  }

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
          <li key={funcionario.id} className="funcionario-item">
            <button
              type="button"
              className={funcionario.ativo ? 'funcionario-linha' : 'funcionario-linha funcionario-inativo'}
              aria-current={painel?.funcionario?.id === funcionario.id ? 'true' : undefined}
              onClick={() => setPainel({ funcionario })}
            >
              <span className="funcionario-nome">
                {funcionario.nome}
                {funcionario.id === logado?.id && <span className="funcionario-selo">Você</span>}
                {!funcionario.ativo && <span className="funcionario-selo">Inativo</span>}
              </span>
              <span className="funcionario-email">{funcionario.email}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="funcionarios-cabecalho">
        <h1 className="titulo-tela">Funcionários</h1>
        <button type="button" className="botao-primario" onClick={() => setPainel({ funcionario: null })}>
          <Plus size={16} aria-hidden="true" />
          Novo funcionário
        </button>
      </header>

      <div className={painel ? 'area-com-painel painel-aberto' : 'area-com-painel'}>
        <div className="funcionarios-lista">{corpoDaLista()}</div>

        {painel && (
          <PainelLateral
            titulo={painel.funcionario ? 'Editar funcionário' : 'Novo funcionário'}
            aoFechar={() => setPainel(null)}
          >
            <FormularioFuncionario
              key={painel.funcionario?.id ?? 'novo'}
              funcionario={painel.funcionario}
              contaPropria={painel.funcionario?.id === logado?.id}
              aoSalvar={aoSalvarFuncionario}
            />
          </PainelLateral>
        )}
      </div>
    </section>
  )
}
