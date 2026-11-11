const DESLOCAMENTO_DO_FUSO_MS = 3 * 60 * 60 * 1000
const SUFIXO_DO_FUSO = '-03:00'

export function relogioDoBanco(instante) {
  return new Date(instante.getTime() - DESLOCAMENTO_DO_FUSO_MS)
}

export function agoraNoBanco() {
  return relogioDoBanco(new Date())
}

export function formatarHorario(horarioDoBanco) {
  return `${horarioDoBanco.toISOString().slice(0, 19)}${SUFIXO_DO_FUSO}`
}

export function formatarHorarioOpcional(horarioDoBanco) {
  return horarioDoBanco ? formatarHorario(horarioDoBanco) : null
}

export function diaDeHoje() {
  return agoraNoBanco().toISOString().slice(0, 10)
}
