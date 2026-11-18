import { Calendar, ClipboardCheck, Droplets, LayoutDashboard, UserCog, Users } from 'lucide-react'

export const itensDoMenu = [
  { caminho: '/agenda', rotulo: 'Agenda', Icone: Calendar },
  { caminho: '/dashboard', rotulo: 'Dashboard', Icone: LayoutDashboard },
  { caminho: '/clientes', rotulo: 'Clientes', Icone: Users },
  { caminho: '/catalogo', rotulo: 'Serviços', Icone: Droplets },
  { caminho: '/qualidade', rotulo: 'Qualidade', Icone: ClipboardCheck },
  { caminho: '/funcionarios', rotulo: 'Funcionários', Icone: UserCog, somenteAdmin: true },
]
