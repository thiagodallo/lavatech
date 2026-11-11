import { rotulosDeStatus } from '../dominio/statusDoAgendamento.js'
import './PilulaDeStatus.css'

export default function PilulaDeStatus({ status }) {
  return (
    <span className={`pilula pilula-${status.replace('_', '-')}`}>{rotulosDeStatus[status]}</span>
  )
}
