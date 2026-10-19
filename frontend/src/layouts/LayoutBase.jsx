import { Droplets, LogOut } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'

import { itensDoMenu } from '../navegacao.js'

export default function LayoutBase() {
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

        <button type="button" className="menu-item menu-sair">
          <LogOut size={16} aria-hidden="true" />
          Sair
        </button>
      </aside>

      <div className="area-principal">
        <header className="cabecalho">
          <span className="cabecalho-empresa">Eco Planet · Estética Automotiva</span>
        </header>
        <main className="conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
