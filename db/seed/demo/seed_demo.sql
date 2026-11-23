INSERT INTO vaga_lavagem (identificacao)
VALUES ('Vaga 1'),
       ('Vaga 2');

INSERT INTO servico (nome, descricao, preco, duracao_minutos)
VALUES ('Lavagem Simples',  'Lavagem externa e secagem',                    35.00,  30),
       ('Lavagem Completa', 'Lavagem externa, aspiração e limpeza interna', 60.00,  60),
       ('Enceramento',      'Lavagem completa com aplicação de cera',       90.00,  90),
       ('Detalhamento',     'Limpeza detalhada interna e externa',         150.00, 120);

INSERT INTO cliente (nome, telefone)
VALUES ('Marcos Andrade',     '(48) 90000-0001'),
       ('Juliana Ferreira',   '(48) 90000-0002'),
       ('Rafael Souza',       '(48) 90000-0003'),
       ('Camila Duarte',      '(48) 90000-0004'),
       ('Eduardo Lima',       '(48) 90000-0005'),
       ('Beatriz Nascimento', '(48) 90000-0006');

INSERT INTO veiculo (cliente_id, placa, marca, modelo, cor)
SELECT cliente.id, dados.placa, dados.marca, dados.modelo, dados.cor
FROM (VALUES ('(48) 90000-0001', 'RSD3G21', 'Fiat',      'Argo',     'Prata'),
             ('(48) 90000-0002', 'QZT1A45', 'VW',        'Gol',      'Branco'),
             ('(48) 90000-0003', 'PBH2C09', 'Honda',     'Civic',    'Preto'),
             ('(48) 90000-0004', 'RTA9F33', 'Hyundai',   'HB20',     'Vermelho'),
             ('(48) 90000-0005', 'QWE4B67', 'Jeep',      'Renegade', 'Cinza'),
             ('(48) 90000-0006', 'RFC7D18', 'Chevrolet', 'Onix',     'Azul')
     ) AS dados (telefone, placa, marca, modelo, cor)
JOIN cliente ON cliente.telefone = dados.telefone;

INSERT INTO agendamento (cliente_id, veiculo_id, servico_id, vaga_id, data_hora_agendada, data_hora_inicio, data_hora_fim, status)
SELECT veiculo.cliente_id, veiculo.id, servico.id, vaga_lavagem.id,
       dia.hoje + dados.horario,
       CASE WHEN dados.status IN ('em_andamento', 'concluido') THEN dia.hoje + dados.horario END,
       CASE WHEN dados.status = 'concluido' THEN dia.hoje + dados.horario + make_interval(mins => servico.duracao_minutos) END,
       dados.status
FROM (VALUES ('RSD3G21', 'Lavagem Simples',  'Vaga 1', time '08:30', 'concluido'),
             ('QZT1A45', 'Lavagem Completa', 'Vaga 2', time '09:00', 'concluido'),
             ('PBH2C09', 'Enceramento',      'Vaga 1', time '10:30', 'em_andamento'),
             ('RTA9F33', 'Lavagem Simples',  'Vaga 2', time '14:00', 'agendado'),
             ('QWE4B67', 'Detalhamento',     'Vaga 1', time '15:00', 'agendado')
     ) AS dados (placa, servico, vaga, horario, status)
CROSS JOIN (SELECT (now() AT TIME ZONE 'America/Sao_Paulo')::date AS hoje) AS dia
JOIN veiculo ON veiculo.placa = dados.placa
JOIN servico ON servico.nome = dados.servico
JOIN vaga_lavagem ON vaga_lavagem.identificacao = dados.vaga;

INSERT INTO agendamento_servico (agendamento_id, servico_id, preco, duracao_minutos)
SELECT agendamento.id, servico.id, servico.preco, servico.duracao_minutos
FROM agendamento
JOIN servico ON servico.id = agendamento.servico_id;

INSERT INTO historico_status (agendamento_id, status_anterior, status_novo)
SELECT id, NULL, status FROM agendamento;

INSERT INTO pagamento (agendamento_id, valor, forma_pagamento, status, pago_em)
SELECT agendamento.id, servico.preco, dados.forma, 'pago', agendamento.data_hora_fim
FROM (VALUES ('RSD3G21', 'pix'), ('QZT1A45', 'cartao_credito')) AS dados (placa, forma)
JOIN veiculo ON veiculo.placa = dados.placa
JOIN agendamento ON agendamento.veiculo_id = veiculo.id
JOIN servico ON servico.id = agendamento.servico_id;
