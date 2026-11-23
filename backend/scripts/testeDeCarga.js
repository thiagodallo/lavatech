const URL_DA_API = process.env.URL_DA_API ?? 'http://localhost:3000/api'
const PESSOAS = Number(process.env.PESSOAS ?? 50)
const SENHA = 'SenhaDeCarga#2026'

async function medir(caminho, corpo, cookie) {
  const inicio = performance.now()
  const resposta = await fetch(`${URL_DA_API}${caminho}`, {
    method: corpo ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(cookie && { Cookie: cookie }) },
    body: corpo && JSON.stringify(corpo),
  })
  await resposta.arrayBuffer()
  return { status: resposta.status, ms: performance.now() - inicio, cookie: resposta.headers.get('set-cookie') }
}

async function simularPessoa(indice, rodada) {
  const email = `carga.${rodada}.${indice}@demo.local`
  const cadastro = await medir('/auth/cadastro', { nome: `Pessoa ${indice}`, email, senha: SENHA })
  const login = await medir('/auth/login', { email, senha: SENHA })
  const cookie = login.cookie?.split(';')[0]
  const agenda = await medir('/agendamentos', null, cookie)
  return { cadastro, login, agenda }
}

function resumir(nome, medicoes) {
  const tempos = medicoes.map(({ ms }) => ms).sort((a, b) => a - b)
  const status = {}
  medicoes.forEach((medicao) => {
    status[medicao.status] = (status[medicao.status] ?? 0) + 1
  })
  const p95 = tempos[Math.floor(tempos.length * 0.95) - 1] ?? tempos.at(-1)
  console.log(`${nome.padEnd(9)} status ${JSON.stringify(status)} mediana ${tempos[tempos.length >> 1].toFixed(0)} ms p95 ${p95.toFixed(0)} ms`)
}

const rodada = Date.now()
const inicio = performance.now()
const resultados = await Promise.all(Array.from({ length: PESSOAS }, (_, indice) => simularPessoa(indice, rodada)))
console.log(`${PESSOAS} pessoas simultâneas em ${((performance.now() - inicio) / 1000).toFixed(1)} s`)
resumir('cadastro', resultados.map(({ cadastro }) => cadastro))
resumir('login', resultados.map(({ login }) => login))
resumir('agenda', resultados.map(({ agenda }) => agenda))
