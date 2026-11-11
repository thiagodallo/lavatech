import { useEffect, useState } from 'react'

function mensagemDoErro(erro) {
  const primeiroCampo = Object.values(erro.campos ?? {})[0]
  return primeiroCampo ?? erro.message
}

export default function usarDadosDaApi(buscar, chave) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true
    setCarregando(true)
    setMensagemDeErro('')

    buscar()
      .then((encontrados) => atual && setDados(encontrados))
      .catch((erro) => {
        if (!atual) return
        setDados(null)
        setMensagemDeErro(mensagemDoErro(erro))
      })
      .finally(() => atual && setCarregando(false))

    return () => {
      atual = false
    }
  }, [chave, tentativa])

  return { dados, carregando, mensagemDeErro, tentarDeNovo: () => setTentativa((anterior) => anterior + 1) }
}
