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
- Prisma (ORM)
- Migrations em SQL versionadas em `db/migration`
- Zod (validação)
- PostgreSQL (banco de dados)

## Funcionalidades

**Cadastros:** funcionários, clientes com seus veículos, e catálogo de serviços e produtos, todos com criação, edição e consulta.

**Agendamento:** cada agendamento é vinculado a cliente, veículo, serviços e uma vaga de lavagem. O conflito é resolvido com lock otimista: o sistema tenta gravar na confirmação e o banco recusa se já existir um agendamento ativo na mesma vaga e horário, por meio do índice único parcial `uq_agendamento_vaga_horario` em `(vaga_id, data_hora_agendada)`, que ignora agendamentos cancelados e no-show. O índice barra o mesmo horário exato, e a sobreposição pela duração do serviço é checada no back-end.

**Pagamento e histórico:** o pagamento aceita cartão de crédito, cartão de débito, PIX e dinheiro. Toda mudança de status do agendamento (agendado, aguardando, em andamento, concluído, cancelado e no-show) fica registrada em `historico_status`, com o funcionário que fez a alteração.

**Alerta de horário:** o atendente recebe um aviso em tela quando o horário de um agendamento está próximo, e o agendamento passa para o status `aguardando`.

**Estoque:** cada movimentação em `movimentacao_estoque` guarda o funcionário responsável, e o sistema sinaliza os itens com nível baixo.

**Controle de qualidade:** quando o status da lavagem muda para concluído, o sistema abre o checklist (lavagem externa sem resíduo de espuma, rodas limpas, vidros sem manchas, interior aspirado, entre outros). O funcionário pontua cada item e marca o resultado como aprovado, aprovado com ressalva ou reprovado, e o checklist preenchido vai para a tela de Qualidade. O horário da conferência é registrado automaticamente.

**Dashboard:** três seções. Operacional traz agendamentos do dia, ocupação das vagas, tempo médio por tipo de serviço, horários de pico e cancelamentos. Financeiro traz faturamento por período, ticket médio e valores a receber. Administrativo traz o ranking de serviços, clientes novos e recorrentes e os itens de estoque com nível baixo.

**Acesso:** perfil único de administrador. O sistema não tem acesso para o cliente final.

## Modelo de dados

O banco tem onze entidades: `funcionario`, `cliente`, `veiculo`, `servico`, `produto`, `movimentacao_estoque`, `vaga_lavagem`, `agendamento`, `pagamento`, `checklist_qualidade` e `historico_status`. A entidade central é `agendamento`, que liga cliente, veículo, vaga e funcionário, e a partir dela saem o pagamento, o checklist e o histórico de status. `funcionario` tem um registro especial, `Sistema (Chatbot)`, com id `-1`, usado por padrão em `agendamento.funcionario_id` e `historico_status.alterado_por`. Ele permite no futuro agendamentos criados ou alterados por um chatbot de WhatsApp sem atendente no meio, e nunca autentica.

Os detalhes de cada tabela estão em [`dicionario_dados.md`](dicionario_dados.md).

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `prisma/schema.prisma` | Schema do Prisma, gerado a partir do banco com `prisma db pull` |
| `db/migration/V1__init_schema.sql` | Criação das tabelas, constraints e dados iniciais |
| `db/migration/V2__unique_vaga_horario.sql` | Índice único parcial que impede dois agendamentos ativos na mesma vaga e horário |
| `00_setup_role_grants.sql` | Criação da role de acesso e permissões no PostgreSQL |
| `dicionario_dados.md` | Dicionário de dados de todas as tabelas |
| `frontend/` | Interface web em React e Vite (setup previsto para a Sprint 2) |
| `backend/` | API em Node.js e Express (setup previsto para a Sprint 2) |

## Status

O projeto está em fase de prototipação. As oito telas do MVP (Login, Agenda, Novo agendamento, Dashboard, Estoque, Qualidade, Clientes e Catálogo) já foram prototipadas e o banco de dados está criado no PostgreSQL, com o schema do Prisma e as migrations V1 e V2 versionadas. Ainda serão prototipadas as telas de funcionários, pagamento e movimentação de estoque, o checklist de qualidade e os formulários de cadastro. No banco, falta a migration V3 para guardar os itens do checklist e o resultado final. A codificação da aplicação acontece de 29/09 a 17/11/2026, com a apresentação final em 01/12/2026.

## Equipe

| Nome | Papel |
|---|---|
| Thiago De Luca Dalló | Líder, Scrum Master, QA |
| Vinicius Fabris dos Santos | UX/UI, Front-end |
| Cauã de Medeiros Rodrigues | Back-end |
| Murilo Claudio Cambruzzi | DBA |

Professor orientador: Hyan Dias Tavares.
