INSERT INTO cliente (nome, telefone)
VALUES ('Marcos Andrade',     '(48) 90000-0001'),
       ('Juliana Ferreira',   '(48) 90000-0002'),
       ('Rafael Souza',       '(48) 90000-0003'),
       ('Camila Duarte',      '(48) 90000-0004'),
       ('Eduardo Lima',       '(48) 90000-0005'),
       ('Beatriz Nascimento', '(48) 90000-0006');

INSERT INTO veiculo (cliente_id, placa, marca, modelo)
SELECT cliente.id, dados.placa, dados.marca, dados.modelo
FROM (VALUES ('(48) 90000-0001', 'RSD3G21', 'Fiat',      'Argo'),
             ('(48) 90000-0002', 'QZT1A45', 'VW',        'Gol'),
             ('(48) 90000-0003', 'PBH2C09', 'Honda',     'Civic'),
             ('(48) 90000-0004', 'RTA9F33', 'Hyundai',   'HB20'),
             ('(48) 90000-0005', 'QWE4B67', 'Jeep',      'Renegade'),
             ('(48) 90000-0006', 'RFC7D18', 'Chevrolet', 'Onix')
     ) AS dados (telefone, placa, marca, modelo)
JOIN cliente ON cliente.telefone = dados.telefone;
