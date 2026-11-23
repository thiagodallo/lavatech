import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router'

import Dialogo from './Dialogo.jsx'
import './FolhaDoMenu.css'

export default function FolhaDoMenu({ itens, aoEscolher, aoSair, aoFechar }) {
  return (
    <Dialogo titulo="Mais" aoFechar={aoFechar}>
      <nav aria-label="Mais opções">
        <ul className="folha-menu">
          {itens.map(({ caminho, rotulo, Icone }) => (
            <li key={caminho}>
              <NavLink to={caminho} className="folha-menu-item" onClick={aoEscolher}>
                <Icone size={20} aria-hidden="true" />
                {rotulo}
              </NavLink>
            </li>
          ))}
          <li>
            <button type="button" className="folha-menu-item folha-menu-sair" onClick={aoSair}>
              <LogOut size={20} aria-hidden="true" />
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </Dialogo>
  )
}
