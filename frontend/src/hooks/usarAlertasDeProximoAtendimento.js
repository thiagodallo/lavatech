import { useEffect, useState } from 'react'

import { listarAlertas } from '../api/agendamentos.js'

const INTERVALO_DA_ATUALIZACAO_EM_MS = 60000

export default function usarAlertasDeProximoAtendimento(versao) {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    let atual = true

    async function carregarAlertas() {
      try {
        const encontrados = await listarAlertas()
        if (atual) setAlertas(encontrados)
      } catch {
        if (atual) setAlertas([])
      }
    }

    carregarAlertas()
    const intervalo = setInterval(carregarAlertas, INTERVALO_DA_ATUALIZACAO_EM_MS)
    return () => {
      atual = false
      clearInterval(intervalo)
    }
  }, [versao])

  return alertas
}
