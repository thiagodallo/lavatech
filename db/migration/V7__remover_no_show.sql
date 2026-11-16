DROP INDEX IF EXISTS uq_agendamento_vaga_horario;

UPDATE agendamento SET status = 'cancelado' WHERE status = 'no_show';
UPDATE historico_status SET status_anterior = 'cancelado' WHERE status_anterior = 'no_show';
UPDATE historico_status SET status_novo = 'cancelado' WHERE status_novo = 'no_show';

ALTER TABLE agendamento DROP CONSTRAINT IF EXISTS agendamento_status_check;
ALTER TABLE agendamento ADD CONSTRAINT agendamento_status_check
    CHECK (status IN ('agendado', 'aguardando', 'em_andamento', 'concluido', 'cancelado'));

CREATE UNIQUE INDEX uq_agendamento_vaga_horario
    ON agendamento (vaga_id, data_hora_agendada)
    WHERE status <> 'cancelado';
