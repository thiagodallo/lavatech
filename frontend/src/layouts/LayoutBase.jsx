import { Droplets, LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router'

import { useSessao } from '../contexts/SessaoContext.jsx'
import { itensDoMenu } from '../navegacao.js'
import './LayoutBase.css'

export default function LayoutBase() {
  const { funcionario, sair } = useSessao()
  const navigate = useNavigate()

  async function encerrarSessao() {
    await sair()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="menu-lateral">
        <div className="marca">
          <span className="marca-icone">
            <Droplets size={16} />
          </span>
          LavaTech
        </div>

        <nav className="menu-itens" aria-label="Menu principal">
          {itensDoMenu.map(({ caminho, rotulo, Icone }) => (
            <NavLink key={caminho} to={caminho} className="menu-item">
              <Icone size={16} aria-hidden="true" />
              {rotulo}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="menu-item menu-sair" onClick={encerrarSessao}>
          <LogOut size={16} aria-hidden="true" />
          Sair
        </button>
      </aside>

      <div className="area-principal">
        <header className="cabecalho">
          <span className="cabecalho-empresa">Eco Planet · Estética Automotiva</span>
          {funcionario && <span className="cabecalho-usuario">{funcionario.nome}</span>}
        </header>
        <main className="conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
