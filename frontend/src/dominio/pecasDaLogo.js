import bloco from '../assets/logo/bloco.png'
import lavaA1 from '../assets/logo/lava-a1.png'
import lavaA2 from '../assets/logo/lava-a2.png'
import lavaL from '../assets/logo/lava-l.png'
import lavaV from '../assets/logo/lava-v.png'
import ondaAlta from '../assets/logo/onda-alta.png'
import ondaBaixa from '../assets/logo/onda-baixa.png'
import techC from '../assets/logo/tech-c.png'
import techE from '../assets/logo/tech-e.png'
import techH from '../assets/logo/tech-h.png'
import techT from '../assets/logo/tech-t.png'

export const LARGURA_DA_LOGO = 1253
export const ALTURA_DA_LOGO = 384

export const pecasDaLogo = [
  { nome: 'bloco', grupo: 'simbolo', cor: 'branco', arquivo: bloco, x: 0, y: 0, largura: 159, altura: 266 },
  { nome: 'onda-alta', grupo: 'simbolo', cor: 'azul', arquivo: ondaAlta, x: 0, y: 231, largura: 220, altura: 107 },
  { nome: 'onda-baixa', grupo: 'simbolo', cor: 'azul', arquivo: ondaBaixa, x: 49, y: 284, largura: 210, altura: 100 },
  { nome: 'lava-l', grupo: 'lava', cor: 'branco', arquivo: lavaL, x: 254, y: 119, largura: 127, altura: 171 },
  { nome: 'lava-a1', grupo: 'lava', cor: 'branco', arquivo: lavaA1, x: 384, y: 161, largura: 132, altura: 132 },
  { nome: 'lava-v', grupo: 'lava', cor: 'branco', arquivo: lavaV, x: 507, y: 164, largura: 147, altura: 127 },
  { nome: 'lava-a2', grupo: 'lava', cor: 'branco', arquivo: lavaA2, x: 646, y: 161, largura: 132, altura: 133 },
  { nome: 'tech-t', grupo: 'tech', cor: 'azul', arquivo: techT, x: 761, y: 119, largura: 147, altura: 172 },
  { nome: 'tech-e', grupo: 'tech', cor: 'azul', arquivo: techE, x: 877, y: 160, largura: 134, altura: 134 },
  { nome: 'tech-c', grupo: 'tech', cor: 'azul', arquivo: techC, x: 1009, y: 160, largura: 109, altura: 134 },
  { nome: 'tech-h', grupo: 'tech', cor: 'azul', arquivo: techH, x: 1125, y: 117, largura: 128, altura: 174 },
]

export const gruposDaLogo = ['simbolo', 'lava', 'tech']
