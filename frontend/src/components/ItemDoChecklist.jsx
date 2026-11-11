import './ItemDoChecklist.css'

export default function ItemDoChecklist({ item, conforme, aoEscolher }) {
  const idDoRotulo = `item-${item.campo}-rotulo`

  return (
    <div className="item-do-formulario">
      <span className="item-do-formulario-rotulo" id={idDoRotulo}>
        {item.rotulo}
      </span>
      <div className="item-do-formulario-opcoes" role="radiogroup" aria-labelledby={idDoRotulo}>
        <label className="item-do-formulario-opcao opcao-conforme">
          <input
            type="radio"
            name={item.campo}
            checked={conforme}
            onChange={() => aoEscolher(true)}
          />
          Conforme
        </label>
        <label className="item-do-formulario-opcao opcao-nao-conforme">
          <input
            type="radio"
            name={item.campo}
            checked={!conforme}
            onChange={() => aoEscolher(false)}
          />
          Não conforme
        </label>
      </div>
    </div>
  )
}
