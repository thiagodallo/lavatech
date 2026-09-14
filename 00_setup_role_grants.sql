-- =========================================================
-- Setup de acesso — Sistema Lava-Rápido
-- Rodar UMA VEZ, como superuser (postgres), ANTES de qualquer
-- aplicação conectar. Não faz parte do fluxo de migration do
-- backend (Flyway/Liquibase) porque CREATE ROLE é operação de
-- cluster, não de schema — fica sob responsabilidade do DBA.
-- =========================================================

-- Troque a senha abaixo antes de rodar. Nunca deixe a senha
-- default em texto plano em nenhum repositório.
CREATE ROLE lavarapido_app WITH LOGIN PASSWORD 'aa';

-- Permissão de conexão no banco
GRANT CONNECT ON DATABASE "LAVATECH" TO lavarapido_app; -- ajustar nome_do_banco

-- Permissão de uso do schema public
GRANT USAGE ON SCHEMA public TO lavarapido_app;

-- Permissões de CRUD nas tabelas que já existem (rodar DEPOIS do V1__init_schema.sql)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lavarapido_app;

-- Permissão de usar as sequences (necessário para os campos SERIAL funcionarem via INSERT)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lavarapido_app;

-- Garante que TABELAS FUTURAS (criadas em V2, V3... por quem tiver privilégio de criar)
-- também herdem essas permissões automaticamente, sem precisar rodar GRANT de novo
-- toda vez que o schema evoluir.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO lavarapido_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO lavarapido_app;

-- O que este role NÃO pode fazer, de propósito:
--   - CREATE TABLE / DROP TABLE / ALTER TABLE (isso fica com o DBA/migrations)
--   - CREATE ROLE, ALTER ROLE (sem escalonamento de privilégio)
--   - Acesso a outros bancos do cluster (só o CONNECT acima)
-- Isso limita o dano possível caso a aplicação seja comprometida
-- (SQL injection, credencial vazada, etc.) — a app só consegue
-- ler/escrever dado, nunca destruir estrutura.
