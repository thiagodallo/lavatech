import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import LayoutBase from './layouts/LayoutBase.jsx'
import Agenda from './pages/Agenda.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Clientes from './pages/Clientes.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Estoque from './pages/Estoque.jsx'
import Login from './pages/Login.jsx'
import NovoAgendamento from './pages/NovoAgendamento.jsx'
import Qualidade from './pages/Qualidade.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<LayoutBase />}>
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/agenda/novo" element={<NovoAgendamento />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/qualidade" element={<Qualidade />} />
        </Route>
        <Route path="*" element={<Navigate to="/agenda" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
