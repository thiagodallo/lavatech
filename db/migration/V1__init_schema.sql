-- Banco: PostgreSQL


-- FUNCIONARIO

CREATE TABLE funcionario (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(150) UNIQUE,
    senha_hash  VARCHAR(255),
    papel       VARCHAR(20)  NOT NULL CHECK (papel IN ('admin', 'atendente', 'sistema')),
    ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Representa ações automáticas do chatbot/sistema.
-- id = -1 (fora da faixa do SERIAL, que começa em 1, então não precisa
-- mexer na sequence). Nunca autentica: sem email, sem senha_hash, ativo=false.
-- Existe só para dar rastreabilidade a agendamentos/status alterados sem atendente humano.
INSERT INTO funcionario (id, nome, email, senha_hash, papel, ativo)
VALUES (-1, 'Sistema (Chatbot)', NULL, NULL, 'sistema', FALSE);


-- CLIENTE

CREATE TABLE cliente (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    telefone    VARCHAR(20)  NOT NULL UNIQUE,
    email       VARCHAR(150),
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);


-- VEICULO

CREATE TABLE veiculo (
    id          SERIAL PRIMARY KEY,
    cliente_id  INT NOT NULL REFERENCES cliente(id),
    placa       VARCHAR(10) NOT NULL UNIQUE,
    marca       VARCHAR(50),
    modelo      VARCHAR(50),
    cor         VARCHAR(30)
);

CREATE INDEX idx_veiculo_cliente_id ON veiculo(cliente_id);


-- SERVICO

CREATE TABLE servico (
    id               SERIAL PRIMARY KEY,
    nome             VARCHAR(100)   NOT NULL,
    descricao        TEXT,
    preco            DECIMAL(10,2)  NOT NULL,
    duracao_minutos  INT            NOT NULL,
    ativo            BOOLEAN        NOT NULL DEFAULT TRUE
);


-- PRODUTO

CREATE TABLE produto (
    id                  SERIAL PRIMARY KEY,
    nome                VARCHAR(100)  NOT NULL,
    categoria           VARCHAR(50),
    unidade_medida      VARCHAR(10),  -- un | litro | kg etc.
    quantidade_atual    DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantidade_minima   DECIMAL(10,2) NOT NULL DEFAULT 0
);


-- MOVIMENTACAO_ESTOQUE

CREATE TABLE movimentacao_estoque (
    id              SERIAL PRIMARY KEY,
    produto_id      INT NOT NULL REFERENCES produto(id),
    tipo            VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade      DECIMAL(10,2) NOT NULL,
    data            TIMESTAMP NOT NULL DEFAULT NOW(),
    funcionario_id  INT NOT NULL REFERENCES funcionario(id),
    observacao      TEXT
);

CREATE INDEX idx_movimentacao_produto_id ON movimentacao_estoque(produto_id);
CREATE INDEX idx_movimentacao_funcionario_id ON movimentacao_estoque(funcionario_id);


-- VAGA_LAVAGEM

CREATE TABLE vaga_lavagem (
    id              SERIAL PRIMARY KEY,
    identificacao   VARCHAR(50) NOT NULL, -- ex: Vaga 1, Vaga 2
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);


-- AGENDAMENTO

CREATE TABLE agendamento (
    id                    SERIAL PRIMARY KEY,
    cliente_id            INT NOT NULL REFERENCES cliente(id),
    veiculo_id            INT NOT NULL REFERENCES veiculo(id),
    servico_id            INT NOT NULL REFERENCES servico(id),
    funcionario_id        INT NOT NULL DEFAULT -1 REFERENCES funcionario(id), -- -1 quando criado pelo chatbot, sem atendente
    vaga_id               INT NOT NULL REFERENCES vaga_lavagem(id),
    data_hora_agendada    TIMESTAMP NOT NULL,
    data_hora_inicio      TIMESTAMP,
    data_hora_fim         TIMESTAMP,
    status                VARCHAR(20) NOT NULL CHECK (
                              status IN ('agendado', 'aguardando', 'em_andamento', 'concluido', 'cancelado', 'no_show')
                          ),
    observacoes           TEXT,
    criado_em             TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em         TIMESTAMP
);

CREATE INDEX idx_agendamento_cliente_id ON agendamento(cliente_id);
CREATE INDEX idx_agendamento_veiculo_id ON agendamento(veiculo_id);
CREATE INDEX idx_agendamento_servico_id ON agendamento(servico_id);
CREATE INDEX idx_agendamento_funcionario_id ON agendamento(funcionario_id);
CREATE INDEX idx_agendamento_vaga_id ON agendamento(vaga_id);
CREATE INDEX idx_agendamento_status ON agendamento(status);
CREATE INDEX idx_agendamento_data_hora_agendada ON agendamento(data_hora_agendada);


-- PAGAMENTO (1:1 com agendamento)

CREATE TABLE pagamento (
    id                SERIAL PRIMARY KEY,
    agendamento_id    INT NOT NULL UNIQUE REFERENCES agendamento(id),
    valor             DECIMAL(10,2) NOT NULL,
    forma_pagamento   VARCHAR(20) NOT NULL CHECK (
                          forma_pagamento IN ('dinheiro', 'pix', 'cartao_debito', 'cartao_credito')
                      ),
    status            VARCHAR(20) NOT NULL CHECK (
                          status IN ('pendente', 'pago', 'estornado')
                      ),
    pago_em           TIMESTAMP
);


-- CHECKLIST_QUALIDADE (1:1 com agendamento)

CREATE TABLE checklist_qualidade (
    id                      SERIAL PRIMARY KEY,
    agendamento_id          INT NOT NULL UNIQUE REFERENCES agendamento(id),
    funcionario_id          INT NOT NULL REFERENCES funcionario(id),
    hora_inicio             TIMESTAMP,
    hora_fim                TIMESTAMP,
    houve_problema          BOOLEAN NOT NULL DEFAULT FALSE,
    descricao_problema      TEXT,
    necessita_retrabalho    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_checklist_funcionario_id ON checklist_qualidade(funcionario_id);


-- HISTORICO_STATUS

CREATE TABLE historico_status (
    id                SERIAL PRIMARY KEY,
    agendamento_id    INT NOT NULL REFERENCES agendamento(id),
    status_anterior   VARCHAR(20),
    status_novo       VARCHAR(20) NOT NULL,
    alterado_por      INT NOT NULL DEFAULT -1 REFERENCES funcionario(id), -- -1 quando alterado automaticamente pelo chatbot
    alterado_em       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historico_agendamento_id ON historico_status(agendamento_id);