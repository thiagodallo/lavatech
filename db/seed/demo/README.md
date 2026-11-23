# Snapshot e restore da demo

A demo roda no banco atual. Antes da palestra tiramos um snapshot dos dados fictícios que já estão lá e, depois, restauramos esse estado. O restore desfaz tudo o que o público fizer: contas novas, clientes, veículos, agendamentos, pagamentos, estornos e edições em registros que já existiam.

Rodar a partir de `backend`, com `DIRECT_URL` (ou `DATABASE_URL`) no `.env`.

## Antes da palestra

```bash
node --env-file=.env scripts/snapshotDaDemo.js snapshot
```

Grava `backend/snapshots-da-demo/snapshot.json`, que fica fora do git porque contém os hashes de senha dos funcionários. Para outro caminho, use `SNAPSHOT_DA_DEMO`.

## Depois da palestra

```bash
CONFIRMAR_RESTORE_DA_DEMO=sim node --env-file=.env scripts/snapshotDaDemo.js restaurar
```

Em uma transação: esvazia as tabelas da aplicação, `sessao` e `limite_requisicao`, recoloca as linhas do snapshot com os mesmos ids e ajusta as sequences. Se algo falhar, nada muda. Todos os usuários logados são desconectados.

O admin e o funcionário `sistema` voltam como estavam no snapshot, com a mesma senha.
