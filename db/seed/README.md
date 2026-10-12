# Seed

Dados de exemplo para desenvolvimento e demonstração. Todos os clientes, telefones e placas são fictícios.

Rodar uma única vez, em ordem, depois das migrations de `db/migration`:

| Arquivo | O que cria |
|---|---|
| `01_vagas_e_admin.sql` | As 2 vagas de lavagem e o funcionário administrador de teste |
| `02_catalogo.sql` | 4 serviços e 4 produtos de estoque |
| `03_clientes_ficticios.sql` | 6 clientes, cada um com um veículo |

O administrador entra com o e-mail `admin@lavatech.local`. A senha de teste foi combinada pela equipe e não fica no repositório, só o hash dela. Esse usuário é para desenvolvimento e não deve existir no banco de produção.

Rodar o seed duas vezes duplica vagas, serviços e produtos, e falha nos clientes por causa do telefone único.
