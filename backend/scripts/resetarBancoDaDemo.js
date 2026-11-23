import { readFile } from 'node:fs/promises'

import bcrypt from 'bcrypt'
import pg from 'pg'

const CUSTO_DO_HASH = 12
const ARQUIVO_DO_SEED = new URL('../../db/seed/demo/seed_demo.sql', import.meta.url)

const LIMPEZA = `
  TRUNCATE pagamento, checklist_qualidade, historico_status, agendamento_servico, agendamento,
           veiculo, cliente, servico, vaga_lavagem, sessao, limite_requisicao
  RESTART IDENTITY;
  DELETE FROM funcionario WHERE papel = 'atendente';
`

function lerConfiguracao() {
  const { DATABASE_URL, DIRECT_URL, DEMO_ADMIN_EMAIL, DEMO_ADMIN_SENHA, CONFIRMAR_RESET_DA_DEMO } = process.env
  if (CONFIRMAR_RESET_DA_DEMO !== 'sim') {
    throw new Error('Defina CONFIRMAR_RESET_DA_DEMO=sim para apagar e recriar os dados da demo')
  }
  if (!DEMO_ADMIN_EMAIL || !DEMO_ADMIN_SENHA || DEMO_ADMIN_SENHA.length < 12) {
    throw new Error('Defina DEMO_ADMIN_EMAIL e DEMO_ADMIN_SENHA (mínimo de 12 caracteres)')
  }
  return { url: DIRECT_URL || DATABASE_URL, email: DEMO_ADMIN_EMAIL.toLowerCase(), senha: DEMO_ADMIN_SENHA }
}

async function garantirAdmin(cliente, email, senha) {
  const senhaHash = await bcrypt.hash(senha, CUSTO_DO_HASH)
  await cliente.query(
    `INSERT INTO funcionario (nome, email, senha_hash, papel, ativo)
     VALUES ('Administrador da Demo', $1, $2, 'admin', TRUE)
     ON CONFLICT (email) DO UPDATE SET senha_hash = EXCLUDED.senha_hash, papel = 'admin', ativo = TRUE`,
    [email, senhaHash],
  )
}

async function resetar() {
  const { url, email, senha } = lerConfiguracao()
  const seed = await readFile(ARQUIVO_DO_SEED, 'utf8')
  const cliente = new pg.Client({ connectionString: url })
  await cliente.connect()
  try {
    await cliente.query('BEGIN')
    await cliente.query(LIMPEZA)
    await garantirAdmin(cliente, email, senha)
    await cliente.query(seed)
    await cliente.query('COMMIT')
  } catch (erro) {
    await cliente.query('ROLLBACK')
    throw erro
  } finally {
    await cliente.end()
  }
  console.log(`Banco da demo restaurado. Admin: ${email}`)
}

await resetar()
