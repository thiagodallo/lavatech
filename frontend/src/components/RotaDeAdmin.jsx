import { Navigate, Outlet } from 'react-router'

import { useSessao } from '../contexts/SessaoContext.jsx'

export default function RotaDeAdmin() {
  const { funcionario } = useSessao()

  if (funcionario?.papel !== 'admin') {
    return <Navigate to="/agenda" replace />
  }

  return <Outlet />
}
