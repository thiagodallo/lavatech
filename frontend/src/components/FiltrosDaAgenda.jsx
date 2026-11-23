import { RefreshCw } from 'lucide-react'

import { filtrosDeStatus } from '../dominio/filtrosDaAgenda.js'
import './FiltrosDaAgenda.css'

function Filtro({ ativo, rotulo, contagem, aoEscolher }) {
  return (
    <button type="button" className="filtro-da-agenda" aria-pressed={ativo} onClick={aoEscolher}>
      {rotulo}
      {contagem !== undefined && <span className="filtro-contagem">{contagem}</span>}
    </button>
  )
}

export default function FiltrosDaAgenda({
  vagas,
  contagens,
  filtroDeStatus,
  vagaId,
  atualizadoEm,
  atualizando,
  podeIrParaAgora,
  aoMudarStatus,
  aoMudarVaga,
  aoIrParaAgora,
  aoAtualizar,
}) {
  return (
    <div className="filtros-da-agenda">
      <div className="filtros-grupo" role="group" aria-label="Filtrar por situação">
        {filtrosDeStatus.map((filtro) => (
          <Filtro
            key={filtro.valor}
            ativo={filtroDeStatus === filtro.valor}
            rotulo={filtro.rotulo}
            contagem={contagens[filtro.valor]}
            aoEscolher={() => aoMudarStatus(filtro.valor)}
          />
        ))}
      </div>

      {vagas.length > 1 && (
        <div className="filtros-grupo" role="group" aria-label="Filtrar por vaga">
          <Filtro ativo={vagaId === null} rotulo="Todas as vagas" aoEscolher={() => aoMudarVaga(null)} />
          {vagas.map((vaga) => (
            <Filtro
              key={vaga.id}
              ativo={vagaId === vaga.id}
              rotulo={vaga.identificacao}
              aoEscolher={() => aoMudarVaga(vaga.id)}
            />
          ))}
        </div>
      )}

      <div className="filtros-acoes">
        {podeIrParaAgora && (
          <button type="button" className="botao-secundario botao-pequeno" onClick={aoIrParaAgora}>
            Agora
          </button>
        )}
        <span className="texto-apoio filtros-atualizacao">Atualizado às {atualizadoEm}</span>
        <button
          type="button"
          className="filtros-atualizar"
          aria-label="Atualizar agenda"
          disabled={atualizando}
          onClick={aoAtualizar}
        >
          <RefreshCw size={16} aria-hidden="true" className={atualizando ? 'filtros-girando' : undefined} />
        </button>
      </div>
    </div>
  )
}
