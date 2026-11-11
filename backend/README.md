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

Estão implementadas `/health`, as três rotas de `/auth` e as de `/clientes`, `/servicos`, `/produtos`, `/funcionarios`, `/vagas`, `/agendamentos`, `/checklists`, `/pagamentos` e `/movimentacoes`. As outras estão aqui para o front-end já saber o que esperar.

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
| GET | `/agendamentos/alertas?minutos=15` | RF08 | Agendamentos que começam nos próximos minutos |
| GET | `/agendamentos/:id` | RF04 | Um agendamento |
| GET | `/agendamentos/:id/historico` | RF07 | Histórico de status |
| POST | `/agendamentos` | RF04, RF05 | Cria agendamento, devolve 409 se a vaga estiver ocupada |
| PATCH | `/agendamentos/:id/status` | RF07, RF10 | Muda o status e grava o histórico; para `concluido` exige o `checklist` no corpo |
| POST | `/agendamentos/:id/pagamento` | RF06 | Registra o pagamento |
| GET | `/agendamentos/:id/pagamento` | RF06 | Consulta o pagamento do agendamento |
| PATCH | `/pagamentos/:id/estorno` | RF06 | Estorna um pagamento pago |
| GET | `/agendamentos/:id/checklist` | RF10 | Consulta o checklist de um atendimento concluído |
| GET | `/checklists?data=&resultado=` | RF10 | Lista os checklists preenchidos, os mais recentes primeiro |
| POST | `/movimentacoes` | RF09 | Registra entrada ou saída e atualiza o saldo do produto |
| GET | `/movimentacoes?produto_id=&limite=50` | RF09 | Lista as movimentações, as mais recentes primeiro |
| GET | `/dashboard/operacional` | RF11 | Indicadores operacionais |
| GET | `/dashboard/financeiro` | RF11 | Indicadores financeiros |
| GET | `/dashboard/administrativo` | RF11 | Indicadores administrativos |

O formato do corpo de cada rota entra neste arquivo junto com o PR que a implementa.

## Clientes e veículos (RF02)

`GET /api/clientes?busca=texto` lista os clientes por ordem de nome, cada um com os seus veículos. Sem `busca`, devolve todos. Com `busca`, devolve quem tem o texto no nome (sem diferenciar maiúsculas), no telefone ou na placa de algum veículo (com ou sem hífen). O telefone é procurado no formato em que fica salvo, `(48) 99988-7766`, então vale digitar um pedaço como `99988`.

```json
[
  {
    "id": 1,
    "nome": "Marcos Andrade",
    "telefone": "(48) 90000-0001",
    "email": null,
    "criado_em": "2026-11-04T19:38:16.403Z",
    "veiculos": [
      { "id": 1, "cliente_id": 1, "placa": "RSD3G21", "marca": "Fiat", "modelo": "Argo", "cor": null }
    ]
  }
]
```

`POST /api/clientes` e `PUT /api/clientes/:id` recebem o mesmo corpo. O `PUT` troca todos os campos, então o `email` que não vier fica nulo.

```json
{ "nome": "Ana Paula", "telefone": "48 99988-7766", "email": "ana@exemplo.com" }
```

- `nome`: de 2 a 150 caracteres.
- `telefone`: 10 ou 11 dígitos com DDD, com ou sem máscara. É salvo e devolvido como `(48) 99988-7766`.
- `email`: opcional, em formato de e-mail.

O `POST` responde 201 e o `PUT` responde 200, os dois com o cliente no formato acima.

`GET /api/clientes/:id/veiculos` lista os veículos do cliente. `POST /api/clientes/:id/veiculos` cadastra um e responde 201 com o veículo criado.

```json
{ "placa": "abc-1d23", "marca": "Fiat", "modelo": "Uno", "cor": "Prata" }
```

- `placa`: obrigatória, no formato antigo (`ABC1234`) ou Mercosul (`ABC1D23`), com ou sem hífen. É salva em maiúsculas e sem hífen.
- `marca` e `modelo` (até 50 caracteres) e `cor` (até 30): opcionais.

Erros próprios destas rotas, além do 400 de corpo inválido e do 401 sem sessão:

| Status | Quando |
|---|---|
| 404 | `Cliente não encontrado`, no `PUT` e nas rotas de veículos com um `id` que não existe |
| 409 | `Telefone já cadastrado` ou `Placa já cadastrada` |

Não existe rota para excluir cliente nem para editar um veículo.

## Serviços e produtos (RF03)

### Serviços

`GET /api/servicos` lista os serviços por ordem de nome, inclusive os desativados. `?ativo=true` devolve só os ativos (é o que a tela de agendamento vai usar) e `?ativo=false` só os desativados.

```json
[
  { "id": 1, "nome": "Lavagem Simples", "descricao": "Lavagem externa e secagem", "preco": 35, "duracao_minutos": 30, "ativo": true }
]
```

`POST /api/servicos` e `PUT /api/servicos/:id` recebem o mesmo corpo. O `PUT` troca todos os campos, então a `descricao` que não vier fica nula.

```json
{ "nome": "Higienização", "descricao": "Limpeza de bancos", "preco": 120.5, "duracao_minutos": 90, "ativo": true }
```

- `nome`: de 2 a 100 caracteres.
- `descricao`: opcional, até 500 caracteres.
- `preco`: número JSON (não texto) de 0 a 99999999.99, com no máximo duas casas decimais.
- `duracao_minutos`: inteiro de 1 a 720. Serve para calcular o fim estimado do agendamento.
- `ativo`: `true` ou `false`. No `POST` é opcional e o padrão é `true`. No `PUT` é obrigatório, para uma edição nunca reativar um serviço sem querer.

O `POST` responde 201 e o `PUT` responde 200, os dois com o serviço no formato acima. Para tirar um serviço do catálogo, edite com `"ativo": false`. Não existe rota de exclusão, porque os agendamentos dependem do serviço.

### Produtos

`GET /api/produtos` lista os produtos por ordem de nome.

```json
[
  { "id": 1, "nome": "Shampoo automotivo", "categoria": "limpeza", "unidade_medida": "litro", "quantidade_atual": 8, "quantidade_minima": 5 }
]
```

`POST /api/produtos` e `PUT /api/produtos/:id` recebem o mesmo corpo.

```json
{ "nome": "Flanela", "categoria": "acessorio", "unidade_medida": "un", "quantidade_minima": 5 }
```

- `nome`: de 2 a 100 caracteres.
- `categoria`: opcional, até 50 caracteres.
- `unidade_medida`: opcional, até 10 caracteres (`un`, `litro`, `kg`, convenção livre).
- `quantidade_minima`: número de 0 a 99999999.99 com até duas casas, e o padrão é 0. É o saldo abaixo do qual o produto vira alerta de reposição.

O `quantidade_atual` não é aceito: se vier no corpo, é ignorado. O produto nasce com saldo 0 e o saldo só muda pelas movimentações de estoque (RF09), que ficam registradas. O `POST` responde 201 e o `PUT` responde 200. Não existe rota de exclusão nem de desativação de produto.

### Erros

Além do 400 de corpo inválido, com os `campos`, e do 401 sem sessão, o `PUT` responde 404 com `Serviço não encontrado` ou `Produto não encontrado` quando o `id` não existe.

## Funcionários (RF01)

No MVP existe um perfil só, o de administrador (decisão do RF12): todo funcionário cadastrado entra como `admin`, e o `papel` não é aceito no corpo. O usuário `Sistema (Chatbot)`, de id `-1`, nunca aparece nas listas nem pode ser editado.

`GET /api/funcionarios` lista os funcionários por ordem de nome, inclusive os desativados. O hash da senha nunca é devolvido.

```json
[
  { "id": 1, "nome": "Administrador", "email": "admin@lavatech.local", "papel": "admin", "ativo": true, "criado_em": "2026-11-04T19:38:16.251Z" }
]
```

`POST /api/funcionarios` cadastra e responde 201 com o funcionário no formato acima.

```json
{ "nome": "Bruno Souza", "email": "bruno@lavatech.local", "senha": "uma-senha-longa" }
```

- `nome`: de 2 a 150 caracteres.
- `email`: e-mail válido, até 150 caracteres. É salvo em minúsculas, e o login também ignora maiúsculas.
- `senha`: de 8 caracteres até 72 bytes (limite do bcrypt). Só vale no corpo e nunca é devolvida.

`PUT /api/funcionarios/:id` edita e responde 200. O corpo troca todos os campos, e a `senha` é opcional: se vier, redefine a senha, e se não vier, a senha atual continua.

```json
{ "nome": "Bruno Souza", "email": "bruno@lavatech.local", "ativo": true, "senha": "nova-senha-longa" }
```

- `ativo`: obrigatório na edição. Não existe rota de exclusão: o funcionário sai do sistema sendo desativado (`"ativo": false`), e o histórico continua apontando para ele.
- Desativar um funcionário ou redefinir a senha dele encerra as sessões abertas dele na hora. Quando o próprio usuário logado redefine a sua senha, a sessão dele continua.

Erros próprios destas rotas, além do 400 de corpo inválido e do 401 sem sessão:

| Status | Quando |
|---|---|
| 404 | `Funcionário não encontrado`, no `PUT` com um `id` que não existe |
| 409 | `E-mail já cadastrado`, ou `Você não pode desativar a própria conta` |

Ainda não existe uma rota de troca de senha que peça a senha atual: a redefinição é feita pelo `PUT`, por qualquer funcionário logado, inclusive para a própria conta.

## Agendamento (RF04, RF05, RF07, RF08)

Todas as rotas desta seção exigem sessão. Um agendamento tem um serviço só, e o funcionário gravado nele é o que está logado.

### Fuso horário

As colunas `data_hora_*` são `TIMESTAMP` sem fuso. A regra única da API: o banco guarda o horário de parede de São Paulo (America/Sao_Paulo, UTC-3 fixo, sem horário de verão), então `10:00` no pgAdmin é 10:00 no relógio da lavação. Por isso o filtro por dia e a conta de sobreposição funcionam direto sobre a coluna.

- Quem envia: `data_hora_agendada` em ISO 8601 **com** fuso (`2026-11-10T10:00:00-03:00` ou `2026-11-10T13:00:00Z`). Sem fuso, devolve 400. A API converte para o horário de São Paulo antes de gravar.
- Quem recebe: todo horário volta como `2026-11-10T10:00:00-03:00`, o mesmo que foi gravado.
- `?data=AAAA-MM-DD` é o dia em São Paulo. Sem `data`, vale o dia de hoje em São Paulo.
- Os horários de início, fim e histórico são gerados pela API no mesmo fuso, em vez de usar o `now()` do banco.

### Vagas

`GET /api/vagas` lista as vagas ativas por id.

```json
[{ "id": 1, "identificacao": "Vaga 1" }, { "id": 2, "identificacao": "Vaga 2" }]
```

### Formato do agendamento

Todas as rotas abaixo devolvem o agendamento neste formato (a lista é um array dele).

```json
{
  "id": 3,
  "data_hora_agendada": "2026-11-10T10:00:00-03:00",
  "data_hora_fim_prevista": "2026-11-10T11:00:00-03:00",
  "data_hora_inicio": null,
  "data_hora_fim": null,
  "status": "agendado",
  "observacoes": "Cliente pediu cera",
  "cliente": { "id": 1, "nome": "Marcos Andrade" },
  "veiculo": { "id": 1, "modelo": "Argo", "placa": "RSD3G21" },
  "servico": { "id": 2, "nome": "Lavagem Completa", "duracao_minutos": 60, "preco": 60 },
  "vaga": { "id": 1, "identificacao": "Vaga 1" }
}
```

`data_hora_fim_prevista` é o horário agendado mais a duração do serviço. `data_hora_inicio` é preenchido quando o status vira `em_andamento` e `data_hora_fim` quando vira `concluido`.

### Agenda do dia (RF04)

`GET /api/agendamentos?data=2026-11-10&status=agendado` lista os agendamentos do dia por horário. `data` e `status` são opcionais. O `status` vale um destes: `agendado`, `aguardando`, `em_andamento`, `concluido`, `cancelado`, `no_show`.

`GET /api/agendamentos/:id` devolve um agendamento, ou 404 `Agendamento não encontrado`.

### Alertas (RF08)

`GET /api/agendamentos/alertas?minutos=15` lista os agendamentos `agendado` ou `aguardando` cujo horário está entre agora e agora mais `minutos`. O padrão é 15 e vale de 1 a 240. Cada item vem no formato acima mais `minutos_restantes`, inteiro arredondado para cima. A rota só calcula: ela nunca muda o status.

### Cadastro (RF04, RF05)

`POST /api/agendamentos` responde 201 com o agendamento. O status inicial é `agendado`.

```json
{ "cliente_id": 1, "veiculo_id": 1, "servico_id": 2, "vaga_id": 1, "data_hora_agendada": "2026-11-10T10:00:00-03:00", "observacoes": "Cliente pediu cera" }
```

- `observacoes`: opcional, até 500 caracteres.
- Não há bloqueio de data passada, para permitir lançar atendimento retroativo.
- Remarcar não existe: cancele e crie outro.

O agendamento e a primeira linha do histórico (`status_anterior` nulo, `status_novo` `agendado`) são gravados na mesma transação.

Conflito de horário: cada agendamento ocupa a vaga de `data_hora_agendada` até o fim previsto. Se o intervalo cruzar com o de outro agendamento da mesma vaga, responde 409 `Vaga ocupada nesse horário`. Agendamentos `cancelado` e `no_show` não ocupam a vaga. Dois pedidos simultâneos para o mesmo horário exato também terminam em um 201 e um 409, porque o índice único do banco recusa o segundo.

| Status | Quando |
|---|---|
| 400 | `O veículo não pertence a esse cliente`, `Serviço inativo` ou `Vaga inativa` |
| 404 | `Cliente não encontrado`, `Serviço não encontrado` ou `Vaga não encontrada` |
| 409 | `Vaga ocupada nesse horário` |

### Mudança de status (RF07)

`PATCH /api/agendamentos/:id/status` com `{ "status": "aguardando" }` devolve o agendamento atualizado. As transições permitidas:

| De | Para |
|---|---|
| `agendado` | `aguardando`, `em_andamento`, `cancelado`, `no_show` |
| `aguardando` | `em_andamento`, `cancelado`, `no_show` |
| `em_andamento` | `concluido`, `cancelado` |
| `concluido`, `cancelado`, `no_show` | nenhuma |

Qualquer outra transição responde 409 `Transição de status não permitida: de concluido para cancelado`. Marcar `aguardando` é manual (a atendente avisa que o cliente chegou). A transição para `concluido` exige o checklist de qualidade, descrito na seção Checklist de qualidade (RF10). Os outros status continuam sem checklist.

A troca atualiza o status e `atualizado_em`, preenche `data_hora_inicio` ou `data_hora_fim` quando for o caso e grava a linha do histórico, tudo na mesma transação: se qualquer passo falhar, nada é salvo. Se duas pessoas mudarem o mesmo agendamento ao mesmo tempo, a segunda recebe 409 `O status do agendamento acabou de ser alterado, atualize a agenda`.

### Histórico

`GET /api/agendamentos/:id/historico` lista as mudanças por ordem de data.

```json
[
  { "status_anterior": null, "status_novo": "agendado", "alterado_em": "2026-11-05T09:12:03-03:00", "alterado_por": { "id": 1, "nome": "Administrador" } },
  { "status_anterior": "agendado", "status_novo": "aguardando", "alterado_em": "2026-11-10T09:55:40-03:00", "alterado_por": { "id": 1, "nome": "Administrador" } }
]
```

Os demais erros são os de sempre: 400 com `campos` para corpo ou filtro inválido, 401 sem sessão e 404 `Agendamento não encontrado` nas rotas com `:id`.

## Pagamento (RF06)

Todas as rotas desta seção exigem sessão. Cada agendamento tem no máximo um pagamento (relação 1:1, garantida por `UNIQUE` no banco). O horário `pago_em` segue a regra de fuso da seção Agendamento: a API gera no relógio de São Paulo e devolve com `-03:00`.

```json
{
  "id": 1,
  "agendamento_id": 12,
  "valor": 55.5,
  "forma_pagamento": "pix",
  "status": "pago",
  "pago_em": "2026-11-10T10:42:15-03:00"
}
```

`POST /api/agendamentos/:id/pagamento` com `{ "valor": 55.5, "forma_pagamento": "pix" }` responde 201 com o pagamento já com `status: "pago"`. O `valor` é maior que zero e tem no máximo duas casas decimais. A `forma_pagamento` vale `dinheiro`, `pix`, `cartao_debito` ou `cartao_credito`. O valor pode ser diferente do preço do serviço, por exemplo num desconto: a API não compara os dois.

Erros do `POST`:

| Status | Quando |
|---|---|
| 400 | Valor ou forma de pagamento inválidos, com `campos` |
| 404 | `Agendamento não encontrado` |
| 409 | `Pagamento já registrado para este agendamento`, inclusive quando dois pedidos chegam juntos (um 201 e um 409) |
| 409 | `Não é possível registrar pagamento de agendamento cancelado ou não compareceu` |

`GET /api/agendamentos/:id/pagamento` devolve o pagamento, ou 404 `Pagamento não encontrado` se o agendamento ainda não foi pago. Se o agendamento não existir, o 404 é `Agendamento não encontrado`.

`PATCH /api/pagamentos/:id/estorno`, sem corpo, muda o pagamento de `pago` para `estornado` e mantém o `pago_em`. Só pagamento `pago` pode ser estornado: outro status devolve 409 `Somente pagamento pago pode ser estornado`, e um id inexistente devolve 404 `Pagamento não encontrado`.

Não existe rota para editar o valor nem para excluir o pagamento. Como cada agendamento aceita um pagamento só, um agendamento estornado não pode ser pago de novo. Isso é um limite conhecido desta versão.

## Estoque (RF09)

Todas as rotas desta seção exigem sessão. O saldo de cada produto é o campo `quantidade_atual` de `GET /api/produtos`. Ele não é editado à mão: só muda por movimentação (o `PUT /produtos/:id` ignora o campo). Não existe rota separada de saldo.

`POST /api/movimentacoes` registra uma entrada ou uma saída:

```json
{ "produto_id": 2, "tipo": "saida", "quantidade": 1.5, "observacao": "Uso na lavagem do Gol" }
```

`tipo` vale `entrada` ou `saida`. `quantidade` é maior que zero, com no máximo duas casas decimais. `observacao` é opcional e vai até 500 caracteres. O funcionário gravado é o que está logado, e a `data` é gerada pela API no relógio de São Paulo, como nos horários do agendamento.

A resposta é 201 com a movimentação e o saldo do produto depois da operação:

```json
{
  "id": 7,
  "produto": { "id": 2, "nome": "Cera líquida", "unidade_medida": "litro" },
  "tipo": "saida",
  "quantidade": 1.5,
  "data": "2026-11-10T14:05:30-03:00",
  "funcionario": { "id": 1, "nome": "Administrador" },
  "observacao": "Uso na lavagem do Gol",
  "saldo_atual": 0.5
}
```

O registro da movimentação e a mudança do saldo acontecem na mesma transação: se um dos dois falhar, nenhum é salvo. A saída é descontada com uma condição no próprio `UPDATE` (o saldo precisa ser maior ou igual à quantidade), então duas saídas simultâneas nunca deixam o saldo negativo.

Erros do `POST`:

| Status | Quando |
|---|---|
| 400 | Quantidade zero, negativa ou com mais de duas casas, tipo inválido, observação longa, `produto_id` ausente |
| 404 | `Produto não encontrado` |
| 409 | `Saldo insuficiente`: a saída é maior que o saldo e nada muda |

`GET /api/movimentacoes?produto_id=2&limite=50` lista as movimentações da mais recente para a mais antiga, no mesmo formato do item acima (sem `saldo_atual`). `produto_id` é opcional e `limite` vale de 1 a 200, com padrão 50. Um `produto_id` sem movimentações devolve `[]`.

Limite conhecido: uma entrada que faria o saldo passar de 99.999.999,99 (o máximo da coluna `DECIMAL(10,2)`) devolve 500.

## Checklist de qualidade (RF10)

Todas as rotas desta seção exigem sessão. O checklist não tem rota de criação própria: ele é enviado junto com a conclusão do atendimento. Isso muda o `PATCH /api/agendamentos/:id/status` com `"status": "concluido"`: sem o objeto `checklist` no corpo, a API responde 400 e nada é gravado. Quem testava a conclusão só com `{ "status": "concluido" }` precisa passar a enviar o checklist.

```json
{
  "status": "concluido",
  "checklist": {
    "externa_sem_espuma": true,
    "rodas_e_pneus_ok": true,
    "vidros_sem_manchas": true,
    "interior_aspirado": true,
    "painel_e_portas_limpos": true,
    "aromatizante_aplicado": true,
    "sem_objetos_esquecidos": true,
    "sem_danos_novos": false,
    "resultado": "aprovado_com_ressalva",
    "descricao_problema": "Risco leve no capô, já existia"
  }
}
```

Os oito itens são obrigatórios e `true` significa conforme. As regras do corpo:

| Regra | Erro |
|---|---|
| `resultado` vale `aprovado`, `aprovado_com_ressalva` ou `reprovado` | 400 |
| `aprovado` exige os oito itens `true` | 400 |
| `aprovado_com_ressalva` e `reprovado` exigem `descricao_problema` não vazia (até 1000 caracteres) | 400 |
| `necessita_retrabalho` (opcional, padrão `false`) só pode ser `true` quando o resultado é `reprovado` | 400 |
| `houve_problema` não é aceito: a API calcula (`true` quando o resultado não é `aprovado`) | 400 |
| `checklist` com qualquer status diferente de `concluido` | 400 |

Nos 400, o `campos` traz a chave `checklist` com as mensagens, por exemplo `{ "campos": { "checklist": ["Resultado aprovado exige todos os itens conformes"] } }`. As outras regras de transição do PATCH continuam as mesmas, inclusive o 409 `Transição de status não permitida` e o 409 de pedidos simultâneos.

O status `concluido` (com `data_hora_fim` e `atualizado_em`), a linha do histórico e o checklist são gravados na mesma transação: se qualquer um falhar, nada é salvo. O `funcionario_id` do checklist é o funcionário logado, `hora_fim` é o instante da conclusão no relógio de São Paulo e `hora_inicio` é o `data_hora_inicio` do agendamento. Um resultado `reprovado` também conclui o atendimento: o checklist é um registro de qualidade, e `necessita_retrabalho` é só informativo.

`GET /api/agendamentos/:id/checklist` devolve o checklist do atendimento:

```json
{
  "id": 4,
  "agendamento_id": 69,
  "externa_sem_espuma": true,
  "rodas_e_pneus_ok": true,
  "vidros_sem_manchas": true,
  "interior_aspirado": true,
  "painel_e_portas_limpos": true,
  "aromatizante_aplicado": true,
  "sem_objetos_esquecidos": true,
  "sem_danos_novos": false,
  "resultado": "aprovado_com_ressalva",
  "descricao_problema": "Risco leve no capô, já existia",
  "houve_problema": true,
  "necessita_retrabalho": false,
  "hora_inicio": "2026-11-10T09:02:11-03:00",
  "hora_fim": "2026-11-10T09:55:40-03:00",
  "funcionario": { "id": 1, "nome": "Administrador" }
}
```

Responde 404 `Checklist não encontrado` se o atendimento ainda não foi concluído e 404 `Agendamento não encontrado` se o id não existe.

`GET /api/checklists?data=2026-11-10&resultado=reprovado` alimenta a tela de qualidade. Os dois filtros são opcionais: `data` (AAAA-MM-DD) filtra pelo dia de `hora_fim` no relógio de São Paulo, e `resultado` pelo resultado. A lista vem dos mais recentes para os mais antigos e traz no máximo 100 itens:

```json
[
  {
    "id": 4,
    "resultado": "aprovado_com_ressalva",
    "houve_problema": true,
    "necessita_retrabalho": false,
    "hora_fim": "2026-11-10T09:55:40-03:00",
    "itens_nao_conformes": ["sem_danos_novos"],
    "funcionario": { "id": 1, "nome": "Administrador" },
    "agendamento": {
      "id": 69,
      "data_hora_agendada": "2026-11-10T09:00:00-03:00",
      "cliente": { "id": 1, "nome": "Marcos Andrade" },
      "veiculo": { "id": 1, "modelo": "Argo", "placa": "RSD3G21" },
      "servico": { "id": 1, "nome": "Lavagem Simples" }
    }
  }
]
```

`itens_nao_conformes` lista os nomes dos itens que vieram `false`. Filtro inválido devolve 400 com `campos`.
