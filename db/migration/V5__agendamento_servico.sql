CREATE TABLE agendamento_servico (
    id               SERIAL PRIMARY KEY,
    agendamento_id   INT           NOT NULL REFERENCES agendamento(id),
    servico_id       INT           NOT NULL REFERENCES servico(id),
    preco            DECIMAL(10,2) NOT NULL,
    duracao_minutos  INT           NOT NULL,
    UNIQUE (agendamento_id, servico_id)
);

CREATE INDEX idx_agendamento_servico_servico_id ON agendamento_servico(servico_id);

INSERT INTO agendamento_servico (agendamento_id, servico_id, preco, duracao_minutos)
SELECT a.id, s.id, s.preco, s.duracao_minutos
FROM agendamento a
JOIN servico s ON s.id = a.servico_id
ORDER BY a.id;

ALTER TABLE agendamento ALTER COLUMN servico_id DROP NOT NULL;
