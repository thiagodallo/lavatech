import { useState } from 'react'

import { marcas, modelosPorMarca } from '../dominio/marcasEModelos.js'
import CampoDeSelecao from './CampoDeSelecao.jsx'
import CampoDeTexto from './CampoDeTexto.jsx'

const OUTRA_OPCAO = '__outra'

function digitadoManualmente(valor, opcoes) {
  return Boolean(valor) && !opcoes.includes(valor)
}

export default function CamposDeMarcaEModelo({ marca, modelo, erros, aoMudar }) {
  const [marcaManual, setMarcaManual] = useState(() => digitadoManualmente(marca, marcas))
  const [modeloManual, setModeloManual] = useState(() =>
    digitadoManualmente(modelo, modelosPorMarca[marca] ?? []),
  )

  const modelosDaMarca = marcaManual ? [] : (modelosPorMarca[marca] ?? [])
  const marcaDaLista = !marcaManual && Boolean(marca)
  const valorDaMarca = marcaManual ? OUTRA_OPCAO : marca
  const valorDoModelo = modeloManual ? OUTRA_OPCAO : modelo

  function escolherMarca(valor) {
    setModeloManual(false)
    if (valor === OUTRA_OPCAO) {
      setMarcaManual(true)
      aoMudar({ marca: '', modelo: '' })
      return
    }
    setMarcaManual(false)
    aoMudar({ marca: valor, modelo: '' })
  }

  function escolherModelo(valor) {
    if (valor === OUTRA_OPCAO) {
      setModeloManual(true)
      aoMudar({ marca, modelo: '' })
      return
    }
    setModeloManual(false)
    aoMudar({ marca, modelo: valor })
  }

  return (
    <>
      <CampoDeSelecao
        id="veiculo-marca"
        rotulo="Marca"
        value={valorDaMarca}
        erro={marcaManual ? undefined : erros.marca?.[0]}
        onChange={(evento) => escolherMarca(evento.target.value)}
      >
        <option value="">Selecione</option>
        {marcas.map((nome) => (
          <option key={nome} value={nome}>
            {nome}
          </option>
        ))}
        <option value={OUTRA_OPCAO}>Outra</option>
      </CampoDeSelecao>

      {marcaManual || !marcaDaLista ? (
        <CampoDeTexto
          id="veiculo-modelo"
          rotulo="Modelo"
          autoComplete="off"
          disabled={!marcaManual}
          placeholder={marcaManual ? undefined : 'Escolha a marca'}
          value={modelo}
          erro={erros.modelo?.[0]}
          onChange={(evento) => aoMudar({ marca, modelo: evento.target.value })}
        />
      ) : (
        <CampoDeSelecao
          id="veiculo-modelo"
          rotulo="Modelo"
          value={valorDoModelo}
          erro={modeloManual ? undefined : erros.modelo?.[0]}
          onChange={(evento) => escolherModelo(evento.target.value)}
        >
          <option value="">Selecione</option>
          {modelosDaMarca.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
          <option value={OUTRA_OPCAO}>Outro</option>
        </CampoDeSelecao>
      )}

      {marcaManual && (
        <CampoDeTexto
          id="veiculo-marca-manual"
          rotulo="Qual marca"
          autoComplete="off"
          value={marca}
          erro={erros.marca?.[0]}
          onChange={(evento) => aoMudar({ marca: evento.target.value, modelo })}
        />
      )}

      {modeloManual && !marcaManual && (
        <CampoDeTexto
          id="veiculo-modelo-manual"
          rotulo="Qual modelo"
          autoComplete="off"
          value={modelo}
          erro={erros.modelo?.[0]}
          onChange={(evento) => aoMudar({ marca, modelo: evento.target.value })}
        />
      )}
    </>
  )
}
