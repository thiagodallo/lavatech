import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import pg from 'pg'

const TABELAS_DA_DEMO = [
  'funcionario',
  'vaga_lavagem',
  'servico',
  'cliente',
  'veiculo',
  'agendamento',
  'agendamento_servico',
  'historico_status',
  'checklist_qualidade',
  'pagamento',
]
const TABELAS_DESCARTAVEIS = ['sessao', 'limite_requisicao']
const PASTA_PADRAO = 'snapshots-da-demo'

function arquivoDoSnapshot() {
  return resolve(process.env.SNAPSHOT_DA_DEMO ?? `${PASTA_PADRAO}/snapshot.json`)
}

async function conectar() {
  const cliente = new pg.Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL })
  await cliente.connect()
  return cliente
}

async function tirarSnapshot(cliente) {
  await cliente.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY')
  const tabelas = {}
  for (const tabela of TABELAS_DA_DEMO) {
    const { rows } = await cliente.query(`SELECT coalesce(json_agg(t), '[]') AS linhas FROM ${tabela} t`)
    tabelas[tabela] = rows[0].linhas
  }
  await cliente.query('COMMIT')
  await mkdir(resolve(arquivoDoSnapshot(), '..'), { recursive: true })
  await writeFile(arquivoDoSnapshot(), JSON.stringify({ criado_em: new Date().toISOString(), tabelas }))
  const resumo = TABELAS_DA_DEMO.map((tabela) => `${tabela}: ${tabelas[tabela].length}`).join(', ')
  console.log(`Snapshot salvo em ${arquivoDoSnapshot()}\n${resumo}`)
}

async function reiniciarSequencia(cliente, tabela) {
  await cliente.query(
    `SELECT setval(pg_get_serial_sequence($1, 'id'), greatest((SELECT max(id) FROM ${tabela}), 1), (SELECT count(*) > 0 FROM ${tabela}))`,
    [tabela],
  )
}

async function restaurarSnapshot(cliente) {
  if (process.env.CONFIRMAR_RESTORE_DA_DEMO !== 'sim') {
    throw new Error('Defina CONFIRMAR_RESTORE_DA_DEMO=sim para substituir os dados atuais pelo snapshot')
  }
  const { criado_em, tabelas } = JSON.parse(await readFile(arquivoDoSnapshot(), 'utf8'))
  await cliente.query('BEGIN')
  try {
    await cliente.query(`TRUNCATE ${[...TABELAS_DA_DEMO, ...TABELAS_DESCARTAVEIS].join(', ')}`)
    for (const tabela of TABELAS_DA_DEMO) {
      await cliente.query(`INSERT INTO ${tabela} SELECT * FROM json_populate_recordset(null::${tabela}, $1)`, [
        JSON.stringify(tabelas[tabela]),
      ])
      await reiniciarSequencia(cliente, tabela)
    }
    await cliente.query('COMMIT')
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  }
  console.log(`Banco restaurado para o snapshot de ${criado_em}`)
}

const ACOES = { snapshot: tirarSnapshot, restaurar: restaurarSnapshot }
const acao = ACOES[process.argv[2]]
if (!acao) {
  console.error('Uso: node scripts/snapshotDaDemo.js snapshot | restaurar')
  process.exit(1)
}

const cliente = await conectar()
try {
  await acao(cliente)
} finally {
  await cliente.end()
}
