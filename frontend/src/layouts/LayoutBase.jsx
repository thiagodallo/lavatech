import { LogOut } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'

import logoClara from '../assets/logo-lavatech-clara.png'
import { useSessao } from '../contexts/SessaoContext.jsx'
import { itensDoMenu } from '../navegacao.js'
import './LayoutBase.css'

export default function LayoutBase() {
  const { funcionario, sair } = useSessao()
  const { pathname } = useLocation()
  return (
    <div className="layout">
      <aside className="menu-lateral">
        <div className="marca">
          <img src={logoClara} alt="LavaTech" className="marca-logo" />
        </div>

        <nav className="menu-itens" aria-label="Menu principal">
          {itensDoMenu
            .filter(({ somenteAdmin }) => !somenteAdmin || funcionario?.papel === 'admin')
            .map(({ caminho, rotulo, Icone }) => (
              <NavLink key={caminho} to={caminho} className="menu-item">
                <Icone size={16} aria-hidden="true" />
                {rotulo}
              </NavLink>
            ))}
        </nav>

        <button type="button" className="menu-item menu-sair" onClick={sair}>
          <LogOut size={16} aria-hidden="true" />
          Sair
        </button>
      </aside>

      <div className="area-principal">
        <header className="cabecalho">
          <span className="cabecalho-empresa">Eco Planet | Estética Automotiva</span>
          {funcionario && <span className="cabecalho-usuario">{funcionario.nome}</span>}
        </header>
        <main className="conteudo">
          <div key={pathname} className="entrada-de-pagina">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
