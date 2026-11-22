import logo from '../assets/logo-lavatech.png'
import './TelaDeCarregamento.css'

export default function TelaDeCarregamento() {
  return (
    <div className="tela-de-carregamento" role="status" aria-label="Carregando o LavaTech">
      <div className="tela-de-carregamento-marca">
        <img src={logo} alt="" className="tela-de-carregamento-logo" />
        <div className="tela-de-carregamento-barra">
          <span className="tela-de-carregamento-progresso" />
        </div>
      </div>
      <span className="tela-de-carregamento-brilho" aria-hidden="true" />
    </div>
  )
}
