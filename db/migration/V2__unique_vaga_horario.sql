-- RF05: uma vaga não pode ter dois agendamentos ativos no mesmo horário.
-- O índice é parcial para que cancelados e no-shows liberem a vaga.
-- A checagem de sobreposição por duração do serviço fica no back-end.
CREATE UNIQUE INDEX uq_agendamento_vaga_horario
    ON agendamento (vaga_id, data_hora_agendada)
    WHERE status NOT IN ('cancelado', 'no_show');
