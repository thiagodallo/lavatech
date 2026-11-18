import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import RotaDeAdmin from './components/RotaDeAdmin.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'
import { SessaoProvider } from './contexts/SessaoContext.jsx'
import LayoutBase from './layouts/LayoutBase.jsx'
import Agenda from './pages/Agenda.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Clientes from './pages/Clientes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Funcionarios from './pages/Funcionarios.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Qualidade from './pages/Qualidade.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <SessaoProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<RotaProtegida />}>
            <Route element={<LayoutBase />}>
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/qualidade" element={<Qualidade />} />
              <Route element={<RotaDeAdmin />}>
                <Route path="/funcionarios" element={<Funcionarios />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/agenda" replace />} />
        </Routes>
      </SessaoProvider>
    </BrowserRouter>
  )
}
