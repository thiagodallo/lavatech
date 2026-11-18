import { rateLimit } from 'express-rate-limit'

import ArmazemDeLimites from '../database/armazemDeLimites.js'

const QUINZE_MINUTOS = 15 * 60 * 1000
const UMA_HORA = 60 * 60 * 1000

function criarLimitador({ prefixo, janelaEmMs, maximo, mensagem, ignorarSucessos = false }) {
  return rateLimit({
    windowMs: janelaEmMs,
    limit: maximo,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: ignorarSucessos,
    passOnStoreError: true,
    message: { erro: mensagem },
    store: new ArmazemDeLimites(prefixo),
  })
}

export const limitarLogin = criarLimitador({
  prefixo: 'login:',
  janelaEmMs: QUINZE_MINUTOS,
  maximo: 10,
  mensagem: 'Muitas tentativas de login. Tente de novo em alguns minutos.',
  ignorarSucessos: true,
})

export const limitarCadastro = criarLimitador({
  prefixo: 'cadastro:',
  janelaEmMs: UMA_HORA,
  maximo: 5,
  mensagem: 'Muitos cadastros deste endereço. Tente de novo mais tarde.',
})
