import { Navigate, Outlet } from 'react-router'

import { useSessao } from '../contexts/SessaoContext.jsx'
import TelaDeCarregamento from './TelaDeCarregamento.jsx'

export default function RotaProtegida() {
  const { funcionario, carregando } = useSessao()

  if (carregando) {
    return <TelaDeCarregamento />
  }

  if (!funcionario) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
