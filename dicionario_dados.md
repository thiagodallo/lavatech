# Dicionário de Dados — Sistema Lavatech

Banco: PostgreSQL | Schema: `public`
Arquivos relacionados: `V1__init_schema.sql` (estrutura), `00_setup_role_grants.sql` (acesso)

---

## funcionario

Usuários internos do sistema (admins e atendentes) + linha semente do chatbot.

| Coluna     | Tipo         | Regras              | Descrição                                                                          |
| ---------- | ------------ | ------------------- | ---------------------------------------------------------------------------------- |
| id         | SERIAL       | PK                  | `-1` é reservado: linha semente "Sistema (Chatbot)", nunca autentica               |
| nome       | VARCHAR(150) | NOT NULL            |                                                                                    |
| email      | VARCHAR(150) | UNIQUE, aceita NULL | NULL apenas na linha semente                                                       |
| senha_hash | VARCHAR(255) | aceita NULL         | Hash da senha (bcrypt/argon2 — decisão do backend). NULL apenas na linha semente   |
| papel      | VARCHAR(20)  | NOT NULL, CHECK     | `admin` \| `atendente` \| `sistema`                                                |
| ativo      | BOOLEAN      | default `true`      | `false` na linha semente — nunca deve aparecer em listas de atendentes disponíveis |
| criado_em  | TIMESTAMP    | default `now()`     |                                                                                    |

**Regra de negócio:** todo `funcionario_id` que representa "ação automática sem atendente humano" (em `agendamento` e `historico_status`) usa `-1`, nunca `NULL`. Isso preserva rastreabilidade em auditorias.

---

## cliente

| Coluna    | Tipo         | Regras           | Descrição                                                                     |
| --------- | ------------ | ---------------- | ----------------------------------------------------------------------------- |
| id        | SERIAL       | PK               |                                                                               |
| nome      | VARCHAR(150) | NOT NULL         |                                                                               |
| telefone  | VARCHAR(20)  | UNIQUE, NOT NULL | Identificador de contato principal — usado por chatbot para localizar cliente |
| email     | VARCHAR(150) | aceita NULL      |                                                                               |
| criado_em | TIMESTAMP    | default `now()`  |                                                                               |

---

## veiculo

| Coluna     | Tipo        | Regras                    | Descrição |
| ---------- | ----------- | ------------------------- | --------- |
| id         | SERIAL      | PK                        |           |
| cliente_id | INT         | FK → cliente.id, NOT NULL |           |
| placa      | VARCHAR(10) | UNIQUE, NOT NULL          |           |
| marca      | VARCHAR(50) | aceita NULL               |           |
| modelo     | VARCHAR(50) | aceita NULL               |           |
| cor        | VARCHAR(30) | aceita NULL               |           |

---

## servico

Catálogo de serviços oferecidos (lavagem simples, completa, enceramento etc.).

| Coluna          | Tipo          | Regras         | Descrição                                                                           |
| --------------- | ------------- | -------------- | ----------------------------------------------------------------------------------- |
| id              | SERIAL        | PK             |                                                                                     |
| nome            | VARCHAR(100)  | NOT NULL       |                                                                                     |
| descricao       | TEXT          | aceita NULL    |                                                                                     |
| preco           | DECIMAL(10,2) | NOT NULL       |                                                                                     |
| duracao_minutos | INT           | NOT NULL       | Usado para calcular `data_hora_fim` estimada do agendamento                         |
| ativo           | BOOLEAN       | default `true` | Desativar em vez de deletar (histórico de agendamentos depende do registro existir) |

---

## produto

Itens de estoque (shampoo, cera, pano etc.).

| Coluna            | Tipo          | Regras              | Descrição                                                               |
| ----------------- | ------------- | ------------------- | ----------------------------------------------------------------------- |
| id                | SERIAL        | PK                  |                                                                         |
| nome              | VARCHAR(100)  | NOT NULL            |                                                                         |
| categoria         | VARCHAR(50)   | aceita NULL         |                                                                         |
| unidade_medida    | VARCHAR(10)   | aceita NULL         | `un` \| `litro` \| `kg` etc. — não validado por CHECK, convenção livre  |
| quantidade_atual  | DECIMAL(10,2) | NOT NULL, default 0 | Saldo atual — atualizado via `movimentacao_estoque`, não editado direto |
| quantidade_minima | DECIMAL(10,2) | NOT NULL, default 0 | Gatilho para alerta de reposição                                        |

---

## movimentacao_estoque

Log de entrada/saída de produtos.

| Coluna         | Tipo          | Regras                        | Descrição                     |
| -------------- | ------------- | ----------------------------- | ----------------------------- |
| id             | SERIAL        | PK                            |                               |
| produto_id     | INT           | FK → produto.id, NOT NULL     |                               |
| tipo           | VARCHAR(10)   | NOT NULL, CHECK               | `entrada` \| `saida`          |
| quantidade     | DECIMAL(10,2) | NOT NULL                      |                               |
| data           | TIMESTAMP     | default `now()`               |                               |
| funcionario_id | INT           | FK → funcionario.id, NOT NULL | Quem registrou a movimentação |
| observacao     | TEXT          | aceita NULL                   |                               |

**Nota para o backend:** esta tabela é um log append-only. `produto.quantidade_atual` deve ser recalculado/atualizado a cada INSERT aqui (via trigger no banco ou lógica na aplicação — decisão de arquitetura em aberto).

---

## vaga_lavagem

Vagas físicas disponíveis para lavagem simultânea.

| Coluna        | Tipo        | Regras         | Descrição              |
| ------------- | ----------- | -------------- | ---------------------- |
| id            | SERIAL      | PK             |                        |
| identificacao | VARCHAR(50) | NOT NULL       | Ex: "Vaga 1", "Vaga 2" |
| ativo         | BOOLEAN     | default `true` |                        |

---

## agendamento

Tabela central do sistema.

| Coluna             | Tipo        | Regras                                      | Descrição                                                                               |
| ------------------ | ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------- |
| id                 | SERIAL      | PK                                          |                                                                                         |
| cliente_id         | INT         | FK → cliente.id, NOT NULL                   |                                                                                         |
| veiculo_id         | INT         | FK → veiculo.id, NOT NULL                   |                                                                                         |
| servico_id         | INT         | FK → servico.id, NOT NULL                   |                                                                                         |
| funcionario_id     | INT         | FK → funcionario.id, NOT NULL, default `-1` | `-1` = criado pelo chatbot, sem atendente humano                                        |
| vaga_id            | INT         | FK → vaga_lavagem.id, NOT NULL              |                                                                                         |
| data_hora_agendada | TIMESTAMP   | NOT NULL                                    | Horário marcado                                                                         |
| data_hora_inicio   | TIMESTAMP   | aceita NULL                                 | Preenchido quando o serviço realmente começa                                            |
| data_hora_fim      | TIMESTAMP   | aceita NULL                                 | Preenchido quando o serviço termina                                                     |
| status             | VARCHAR(20) | NOT NULL, CHECK                             | `agendado` \| `aguardando` \| `em_andamento` \| `concluido` \| `cancelado` \| `no_show` |
| observacoes        | TEXT        | aceita NULL                                 |                                                                                         |
| criado_em          | TIMESTAMP   | default `now()`                             |                                                                                         |
| atualizado_em      | TIMESTAMP   | aceita NULL                                 | Backend deve atualizar manualmente a cada mudança (sem trigger automático definido)     |

**Regra de negócio:** toda transição de `status` deve gerar uma linha correspondente em `historico_status` — não é imposto pelo banco (sem trigger), é responsabilidade da aplicação.

---

## pagamento

Relação 1:1 com `agendamento`.

| Coluna          | Tipo          | Regras                                | Descrição                                                  |
| --------------- | ------------- | ------------------------------------- | ---------------------------------------------------------- |
| id              | SERIAL        | PK                                    |                                                            |
| agendamento_id  | INT           | FK → agendamento.id, UNIQUE, NOT NULL | Unicidade garante 1:1                                      |
| valor           | DECIMAL(10,2) | NOT NULL                              |                                                            |
| forma_pagamento | VARCHAR(20)   | NOT NULL, CHECK                       | `dinheiro` \| `pix` \| `cartao_debito` \| `cartao_credito` |
| status          | VARCHAR(20)   | NOT NULL, CHECK                       | `pendente` \| `pago` \| `estornado`                        |
| pago_em         | TIMESTAMP     | aceita NULL                           |                                                            |

---

## checklist_qualidade

Relação 1:1 com `agendamento`.

| Coluna               | Tipo      | Regras                                | Descrição            |
| -------------------- | --------- | ------------------------------------- | -------------------- |
| id                   | SERIAL    | PK                                    |                      |
| agendamento_id       | INT       | FK → agendamento.id, UNIQUE, NOT NULL |                      |
| funcionario_id       | INT       | FK → funcionario.id, NOT NULL         | Quem fez o checklist |
| hora_inicio          | TIMESTAMP | aceita NULL                           |                      |
| hora_fim             | TIMESTAMP | aceita NULL                           |                      |
| houve_problema       | BOOLEAN   | default `false`                       |                      |
| descricao_problema   | TEXT      | aceita NULL                           |                      |
| necessita_retrabalho | BOOLEAN   | default `false`                       |                      |

---

## historico_status

Log append-only de mudanças de status do agendamento.

| Coluna          | Tipo        | Regras                                      | Descrição                                       |
| --------------- | ----------- | ------------------------------------------- | ----------------------------------------------- |
| id              | SERIAL      | PK                                          |                                                 |
| agendamento_id  | INT         | FK → agendamento.id, NOT NULL               |                                                 |
| status_anterior | VARCHAR(20) | aceita NULL                                 | NULL na primeira linha (criação do agendamento) |
| status_novo     | VARCHAR(20) | NOT NULL                                    |                                                 |
| alterado_por    | INT         | FK → funcionario.id, NOT NULL, default `-1` | `-1` = alteração automática do chatbot          |
| alterado_em     | TIMESTAMP   | default `now()`                             |                                                 |

---

## Convenções gerais

- **Nomenclatura:** `snake_case` em todo o banco — compatível com mapeamento automático do Hibernate/JPA (converte para `camelCase` em Java sem configuração extra).
- **Enums via CHECK, não via tipo ENUM nativo do Postgres:** decisão deliberada — `CHECK` é mais simples de alterar (`ALTER TABLE ... DROP CONSTRAINT` / recriar) do que `ALTER TYPE`, que tem restrições em transação. Se a lista de valores mudar com frequência no início do projeto, isso evita dor de cabeça.
- **Soft delete:** tabelas com `ativo BOOLEAN` (`funcionario`, `servico`, `vaga_lavagem`) devem ser desativadas, não deletadas — várias têm histórico de agendamento dependente.
- **Linha semente `funcionario.id = -1`:** nunca filtrar `funcionario` por `id > 0` sem necessidade — mas todo `SELECT` voltado a "funcionários reais" (ex: lista de atendentes num dropdown) deve excluir `ativo = false` OU explicitamente `id != -1`.
