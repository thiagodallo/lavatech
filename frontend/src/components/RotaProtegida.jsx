import { Navigate, Outlet } from 'react-router'

import { useSessao } from '../contexts/SessaoContext.jsx'
import './RotaProtegida.css'

export default function RotaProtegida() {
  const { funcionario, carregando } = useSessao()

  if (carregando) {
    return (
      <p className="texto-apoio carregando-sessao" role="status">
        Carregando
      </p>
    )
  }

  if (!funcionario) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
