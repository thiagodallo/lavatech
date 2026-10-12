CREATE TABLE sessao (
    sid     VARCHAR      PRIMARY KEY,
    sess    JSON         NOT NULL,
    expire  TIMESTAMP(6) NOT NULL
);

CREATE INDEX idx_sessao_expire ON sessao(expire);
