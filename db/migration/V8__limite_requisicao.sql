CREATE TABLE limite_requisicao (
    chave        VARCHAR(255) PRIMARY KEY,
    acessos      INT          NOT NULL,
    reinicia_em  TIMESTAMPTZ  NOT NULL
);

CREATE INDEX idx_limite_requisicao_reinicia_em ON limite_requisicao(reinicia_em);
