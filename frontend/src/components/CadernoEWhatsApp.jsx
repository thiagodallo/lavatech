import './CadernoEWhatsApp.css'

export default function CadernoEWhatsApp() {
  return (
    <div className="caos" aria-hidden="true">
      <div className="caos-caderno">
        <p>Sáb 14/11</p>
        <p>Vaga 1 &nbsp;9h &nbsp;Gol (João)</p>
        <p>
          Vaga 1 &nbsp;<s className="caos-risco">9h Onix</s> 9h Hilux <span className="caos-duvida">??</span>
        </p>
        <p>
          Vaga 2 &nbsp;10h30 Polo <span className="caos-duvida">lavou? ok?</span>
        </p>
        <p className="caos-fim">
          fim do mês: <span className="caos-duvida">R$ ???</span>
        </p>
      </div>
      <div className="caos-conversa">
        <p className="caos-balao">
          <span className="caos-autor">Maria</span>
          tem horário 9h sábado?
        </p>
        <p className="caos-balao caos-balao-resposta">pode vir 9h!</p>
        <p className="caos-balao">
          <span className="caos-autor">Pedro</span>
          combinei 9h também
        </p>
      </div>
    </div>
  )
}
