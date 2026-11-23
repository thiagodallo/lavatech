import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'

import { useSessao } from '../contexts/SessaoContext.jsx'
import { ehAdmin } from '../dominio/permissoes.js'
import { caminhosDasAbas, itensDoMenu } from '../navegacao.js'
import FolhaDoMenu from './FolhaDoMenu.jsx'
import './BarraDeAbas.css'

export default function BarraDeAbas() {
  const { funcionario, sair } = useSessao()
  const { pathname } = useLocation()
  const [folhaAberta, setFolhaAberta] = useState(false)
  const abas = itensDoMenu.filter(({ caminho }) => caminhosDasAbas.includes(caminho))
  const itensDoMais = itensDoMenu.filter(
    ({ caminho, somenteAdmin }) => !caminhosDasAbas.includes(caminho) && (!somenteAdmin || ehAdmin(funcionario)),
  )
  const emUmItemDoMais = itensDoMais.some(({ caminho }) => pathname.startsWith(caminho))

  return (
    <>
      <nav className="barra-de-abas" aria-label="Menu principal">
        {abas.map(({ caminho, rotulo, Icone }) => (
          <NavLink key={caminho} to={caminho} className="aba">
            <Icone size={22} aria-hidden="true" />
            {rotulo}
          </NavLink>
        ))}
        <button
          type="button"
          className={emUmItemDoMais ? 'aba active' : 'aba'}
          aria-haspopup="dialog"
          aria-current={emUmItemDoMais ? 'page' : undefined}
          onClick={() => setFolhaAberta(true)}
        >
          <Ellipsis size={22} aria-hidden="true" />
          Mais
        </button>
      </nav>

      {folhaAberta && (
        <FolhaDoMenu
          itens={itensDoMais}
          aoEscolher={() => setFolhaAberta(false)}
          aoSair={sair}
          aoFechar={() => setFolhaAberta(false)}
        />
      )}
    </>
  )
}
