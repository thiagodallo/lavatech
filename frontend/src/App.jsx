import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import RotaProtegida from './components/RotaProtegida.jsx'
import { SessaoProvider } from './contexts/SessaoContext.jsx'
import LayoutBase from './layouts/LayoutBase.jsx'
import Agenda from './pages/Agenda.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Clientes from './pages/Clientes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Funcionarios from './pages/Funcionarios.jsx'
import Login from './pages/Login.jsx'
import Qualidade from './pages/Qualidade.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <SessaoProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RotaProtegida />}>
            <Route element={<LayoutBase />}>
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/qualidade" element={<Qualidade />} />
              <Route path="/funcionarios" element={<Funcionarios />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/agenda" replace />} />
        </Routes>
      </SessaoProvider>
    </BrowserRouter>
  )
}
