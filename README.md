# LavaTech

Sistema web de uso interno para gestão de agendamentos, pagamentos, estoque e qualidade da Eco Planet, estética automotiva em Criciúma, SC.

- **EQUIPE:** Thiago Dallo, Vinicius Fabris, Cauã Rodrigues e Murilo Cambruzzi.
- **DISCIPLINA:** Projeto Integrador: Sistema Web
- **CURSO:** Engenharia de Software - 4ª fase
- **FACULDADE:** UniSATC

## Problema

A Eco Planet controla os agendamentos manualmente, por WhatsApp e caderno físico, sem histórico de atendimentos e sem controle de conflito de horário. O lava-rápido tem duas vagas de lavagem simultâneas, e hoje nada impede que dois clientes sejam marcados na mesma vaga e no mesmo horário.

## Tecnologias

- React e Vite (front-end)
- React Router DOM
- Context API (restrita à sessão do funcionário logado)
- Node.js e Express (back-end)
- Prisma (ORM e migrations)
- Zod (validação)
- PostgreSQL (banco de dados)

## Funcionalidades

**Cadastros:** funcionários, clientes com seus veículos, e catálogo de serviços e produtos, todos com criação, edição e consulta.

**Agendamento:** cada agendamento é vinculado a cliente, veículo, serviços e uma vaga de lavagem. O conflito é resolvido com lock otimista, checando no momento da confirmação por meio de uma constraint única em `(vaga_id, horário)` no banco, então duas confirmações simultâneas nunca ocupam a mesma vaga.

**Pagamento e histórico:** o pagamento aceita cartão de crédito, cartão de débito, PIX e dinheiro. Toda mudança de status do agendamento (agendado, em execução, concluído, cancelado) fica registrada em `historico_status`, com o funcionário que fez a alteração.

**Alerta de horário:** o atendente recebe um aviso em tela quando o horário de um agendamento está próximo.

**Estoque:** cada movimentação em `movimentacao_estoque` guarda o funcionário responsável, e o sistema sinaliza os itens com nível baixo.

**Controle de qualidade:** ao fim de cada lavagem o funcionário preenche um checklist (lavagem externa sem resíduo de espuma, rodas limpas, vidros sem manchas, interior aspirado, entre outros) e marca o resultado como aprovado, aprovado com ressalva ou reprovado. O horário da conferência é registrado automaticamente.

**Dashboard:** total de agendamentos do dia, faturamento por período, ranking de serviços, ticket médio, clientes novos e recorrentes, tempo médio por tipo de serviço, horários de pico e cancelamentos.

**Acesso:** perfil único de administrador. O sistema não tem acesso para o cliente final.

## Modelo de dados

O banco tem onze entidades: `funcionario`, `cliente`, `veiculo`, `servico`, `produto`, `movimentacao_estoque`, `vaga_lavagem`, `agendamento`, `pagamento`, `checklist_qualidade` e `historico_status`. A entidade central é `agendamento`, que liga cliente, veículo, vaga e funcionário, e a partir dela saem o pagamento, o checklist e o histórico de status. Algumas colunas são nullable de propósito, como `agendamento.funcionario_id`, para permitir no futuro agendamentos criados por um chatbot de WhatsApp sem atendente no meio.

Os detalhes de cada tabela estão em [`dicionario_dados.md`](dicionario_dados.md).

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `prisma/schema.prisma` | Schema do Prisma, gerado a partir do banco com `prisma db pull` |
| `db/migration/V1__init_schema.sql` | Criação das tabelas, constraints e dados iniciais |
| `00_setup_role_grants.sql` | Criação da role de acesso e permissões no PostgreSQL |
| `dicionario_dados.md` | Dicionário de dados de todas as tabelas |

## Status

O projeto está em fase de prototipação. As oito telas do MVP (Login, Agenda, Novo agendamento, Dashboard, Estoque, Qualidade, Clientes e Catálogo) já foram prototipadas e o banco de dados está modelado. A codificação da aplicação acontece de 29/09 a 17/11/2026, com a apresentação final em 01/12/2026.

## Equipe

| Nome | Papel |
|---|---|
| Thiago De Luca Dalló | Líder, Scrum Master, QA |
| Vinicius Fabris dos Santos | UX/UI, Front-end |
| Cauã de Medeiros Rodrigues | Back-end |
| Murilo Claudio Cambruzzi | DBA |

Professor orientador: Hyan Dias Tavares.
