import CampoDeTexto from './CampoDeTexto.jsx'
import CamposDeMarcaEModelo from './CamposDeMarcaEModelo.jsx'

export default function CamposDoVeiculo({ campos, aoMudar, erros, versao = 0, placaObrigatoria = true }) {
  function alterar(campo) {
    return (evento) => aoMudar({ [campo]: evento.target.value })
  }

  return (
    <div className="veiculos-campos">
      <CampoDeTexto
        id="veiculo-placa"
        rotulo="Placa"
        required={placaObrigatoria}
        maxLength={8}
        autoComplete="off"
        value={campos.placa}
        erro={erros.placa?.[0]}
        onChange={alterar('placa')}
      />
      <CampoDeTexto
        id="veiculo-cor"
        rotulo="Cor"
        autoComplete="off"
        value={campos.cor}
        erro={erros.cor?.[0]}
        onChange={alterar('cor')}
      />
      <CamposDeMarcaEModelo
        key={versao}
        marca={campos.marca}
        modelo={campos.modelo}
        erros={erros}
        aoMudar={aoMudar}
      />
    </div>
  )
}
