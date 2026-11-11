import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { listarChecklists } from '../api/checklists.js'
import CartaoDeChecklist from '../components/CartaoDeChecklist.jsx'
import SeletorDeDia from '../components/SeletorDeDia.jsx'
import { dataDeHoje, ehDataValida } from '../formatacao/horario.js'
import './Qualidade.css'

export default function Qualidade() {
  const [parametros, definirParametros] = useSearchParams()
  const hoje = dataDeHoje()
  const dataDaUrl = parametros.get('data')
  const data = ehDataValida(dataDaUrl) ? dataDaUrl : hoje
  const [checklists, setChecklists] = useState([])
  const [diaCarregado, setDiaCarregado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const checklistsDoDia = diaCarregado === data ? checklists : []

  useEffect(() => {
    let atual = true

    async function carregarChecklists() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarChecklists(data)
        if (!atual) return
        setChecklists(encontrados)
        setDiaCarregado(data)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarChecklists()
    return () => {
      atual = false
    }
  }, [data, tentativa])

  function mudarDia(novaData) {
    definirParametros(novaData === hoje ? {} : { data: novaData })
  }

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="qualidade-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && checklistsDoDia.length === 0) {
      return (
        <p className="qualidade-estado texto-apoio" role="status">
          Carregando
        </p>
      )
    }

    if (checklistsDoDia.length === 0) {
      return <p className="qualidade-estado texto-apoio">Nenhum checklist neste dia</p>
    }

    return (
      <ul className="qualidade-itens">
        {checklistsDoDia.map((checklist) => (
          <CartaoDeChecklist key={checklist.id} checklist={checklist} />
        ))}
      </ul>
    )
  }

  return (
    <section>
      <header className="qualidade-cabecalho">
        <h1 className="titulo-tela">Qualidade</h1>
        <div className="qualidade-acoes">
          <SeletorDeDia data={data} hoje={hoje} aoMudar={mudarDia} />
        </div>
      </header>

      <div className="qualidade-lista">{corpoDaLista()}</div>
    </section>
  )
}
