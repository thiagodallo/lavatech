# Banco da demo

Dados só fictícios para a apresentação. Nenhum nome, telefone ou placa pertence a uma pessoa real.

## Reset

O script `backend/scripts/resetarBancoDaDemo.js` apaga tudo o que o público criou e recria o estado inicial em uma única transação:

- esvazia agendamentos, pagamentos, checklists, histórico, clientes, veículos, serviços, vagas, `sessao` e `limite_requisicao`;
- apaga todos os funcionários com papel `atendente`, mantém o `sistema` (id -1) e os admins;
- cria ou atualiza o admin da demo com a senha vinda do ambiente;
- roda `seed_demo.sql`, com a agenda montada para o dia em que o reset roda.

Rodar a partir de `backend`, depois das migrations:

```bash
CONFIRMAR_RESET_DA_DEMO=sim \
DEMO_ADMIN_EMAIL=admin@exemplo.local \
DEMO_ADMIN_SENHA='senha forte com 12 ou mais caracteres' \
node --env-file=.env scripts/resetarBancoDaDemo.js
```

Usa `DIRECT_URL` quando existir e cai para `DATABASE_URL`. Se a senha estiver em arquivo `.env`, coloque entre aspas: sem aspas, tudo depois de `#` vira comentário.

A senha do admin nunca vai para o repositório nem para o log.
