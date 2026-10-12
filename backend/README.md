# Back-end

API do LavaTech em Node.js e Express, organizada em três camadas: rotas, regras de negócio e acesso a dados.

## Tecnologias

- Node.js 22.12 ou mais novo
- Express 5
- Prisma 7 (ORM, com o adaptador `@prisma/adapter-pg`; o schema é gerado a partir do banco)
- Zod (validação)
- express-session e connect-pg-simple (sessão guardada no PostgreSQL)
- bcrypt (conferência da senha)
- PostgreSQL

## Como rodar

O banco precisa existir antes, com as migrations de `db/migration` aplicadas em ordem. Depois, dentro de `backend/`:

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

Edite o `.env` antes do `npm run dev`: a senha real da role `lavarapido_app` na `DATABASE_URL` e um texto aleatório de pelo menos 32 caracteres em `SESSION_SECRET`. Esse arquivo não vai para o Git.

Para gerar o `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Com a API no ar, `http://localhost:3000/api/health` responde `{"api":"ok","banco":"ok"}` se a conexão com o banco estiver funcionando.

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API e reinicia a cada arquivo salvo |
| `npm start` | Sobe a API sem reiniciar |
| `npm run db:pull` | Atualiza `prisma/schema.prisma` a partir do banco, rodar depois de cada migration |
| `npm run db:generate` | Gera o client do Prisma a partir do schema |

## Estrutura

```
backend/
├── prisma/
│   └── schema.prisma     # gerado com db:pull, não editar à mão
├── prisma.config.js      # onde a CLI do Prisma acha o schema e a URL do banco
├── src/
│   ├── server.js         # sobe o servidor na porta do .env
│   ├── app.js            # monta o Express: JSON, rotas e erros
│   ├── config/           # leitura e validação do .env, configuração da sessão
│   ├── database/         # instância única do Prisma, ligada ao banco pelo adaptador
│   ├── routes/           # recebe a requisição e devolve a resposta
│   ├── services/         # regras de negócio
│   ├── repositories/     # consultas ao banco
│   ├── schemas/          # formato esperado do corpo de cada rota (Zod)
│   ├── middlewares/      # validação do corpo, sessão obrigatória, 404 e erro
│   └── errors/           # erro de regra de negócio com status HTTP
└── .env.example
```

A rota chama o service, o service chama o repository, e só o repository usa o Prisma. Rota não acessa o banco direto.

## Erros

Toda resposta de erro é um JSON com o campo `erro`. Quem lança o erro não monta a resposta, isso fica em `middlewares/tratarErros.js`.

| Status | Quando | Corpo |
|---|---|---|
| 400 | Corpo não passou na validação do Zod | `{"erro":"Dados inválidos","campos":{"nome":["..."]}}` |
| 400 | JSON malformado | `{"erro":"JSON inválido"}` |
| 401 | Sem sessão ativa ou login recusado | `{"erro":"..."}` |
| 404 | Rota ou registro não existe | `{"erro":"..."}` |
| 409 | Registro duplicado ou vaga ocupada no horário | `{"erro":"..."}` |
| 500 | Erro não previsto, o detalhe fica só no log | `{"erro":"Erro interno do servidor"}` |

Para devolver um erro de regra de negócio, o service lança `new ErroDeAplicacao(status, mensagem)`.

## Autenticação

O login cria uma sessão guardada na tabela `sessao` do PostgreSQL (migration V4) e devolve o cookie `connect.sid`. O navegador reenvia esse cookie sozinho a cada requisição. O cookie é `HttpOnly`, então o JavaScript da página não consegue ler, e vale por 8 horas. A sessão guarda só o id do funcionário.

A senha nunca é guardada nem comparada em texto: o banco tem o hash em `funcionario.senha_hash` e o `bcrypt` confere a senha digitada contra ele.

`POST /api/auth/login`

```json
{ "email": "admin@lavatech.local", "senha": "..." }
```

Responde 200 com o funcionário, sem o hash da senha:

```json
{ "id": 1, "nome": "Administrador", "email": "admin@lavatech.local", "papel": "admin" }
```

Responde 401 com `{"erro":"E-mail ou senha inválidos"}` para senha errada, e-mail que não existe ou funcionário desativado. A mensagem é a mesma nos três casos, para não revelar quais e-mails estão cadastrados.

`GET /api/auth/me` devolve o funcionário logado no mesmo formato, ou 401 se não houver sessão. O front-end chama essa rota ao abrir para saber se já existe alguém logado.

`POST /api/auth/logout` apaga a sessão e o cookie. Responde 204, sem corpo.

Toda rota registrada depois do `exigirSessao` em `routes/index.js` responde 401 sem sessão. Rota nova entra abaixo dessa linha.

## Contrato da API

Todas as rotas ficam sob `/api`, recebem e devolvem JSON. Os nomes dos campos seguem as colunas do banco, em `snake_case`. Com exceção de `/health` e `/auth/login`, todas vão exigir sessão.

Estão implementadas `/health` e as três rotas de `/auth`. As outras estão aqui para o front-end já saber o que esperar.

| Método | Rota | Requisito | Para que serve |
|---|---|---|---|
| GET | `/health` | | Confere se a API e o banco respondem |
| POST | `/auth/login` | RF12 | Entra com e-mail e senha |
| POST | `/auth/logout` | RF12 | Encerra a sessão |
| GET | `/auth/me` | RF12 | Devolve o funcionário logado |
| GET, POST | `/funcionarios` | RF01 | Lista e cadastra funcionários |
| PUT | `/funcionarios/:id` | RF01 | Edita um funcionário |
| GET, POST | `/clientes` | RF02 | Lista e cadastra clientes |
| PUT | `/clientes/:id` | RF02 | Edita um cliente |
| GET, POST | `/clientes/:id/veiculos` | RF02 | Lista e cadastra veículos do cliente |
| GET, POST | `/servicos` | RF03 | Lista e cadastra serviços |
| PUT | `/servicos/:id` | RF03 | Edita um serviço |
| GET, POST | `/produtos` | RF03 | Lista e cadastra produtos |
| PUT | `/produtos/:id` | RF03 | Edita um produto |
| GET | `/vagas` | RF04 | Lista as vagas de lavagem |
| GET | `/agendamentos?data=AAAA-MM-DD` | RF04, RF08 | Agenda do dia |
| POST | `/agendamentos` | RF04, RF05 | Cria agendamento, devolve 409 se a vaga estiver ocupada |
| PATCH | `/agendamentos/:id/status` | RF07 | Muda o status e grava o histórico |
| POST | `/agendamentos/:id/pagamento` | RF06 | Registra o pagamento |
| POST | `/agendamentos/:id/checklist` | RF10 | Salva o checklist e conclui a lavagem |
| GET | `/checklists` | RF10 | Lista os checklists preenchidos |
| GET | `/estoque` | RF09 | Saldo dos produtos |
| POST | `/estoque/movimentacoes` | RF09 | Registra entrada ou saída |
| GET | `/dashboard/operacional` | RF11 | Indicadores operacionais |
| GET | `/dashboard/financeiro` | RF11 | Indicadores financeiros |
| GET | `/dashboard/administrativo` | RF11 | Indicadores administrativos |

O formato do corpo de cada rota entra neste arquivo junto com o PR que a implementa.
