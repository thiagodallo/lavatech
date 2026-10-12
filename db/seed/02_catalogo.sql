INSERT INTO servico (nome, descricao, preco, duracao_minutos)
VALUES ('Lavagem Simples',  'Lavagem externa e secagem',                    35.00,  30),
       ('Lavagem Completa', 'Lavagem externa, aspiração e limpeza interna', 60.00,  60),
       ('Enceramento',      'Lavagem completa com aplicação de cera',       90.00,  90),
       ('Detalhamento',     'Limpeza detalhada interna e externa',         150.00, 120);

INSERT INTO produto (nome, categoria, unidade_medida, quantidade_atual, quantidade_minima)
VALUES ('Shampoo automotivo',   'limpeza',    'litro',  8,  5),
       ('Cera líquida',         'acabamento', 'litro',  2,  5),
       ('Toalha de microfibra', 'acessorio',  'un',    14, 10),
       ('Pretinho de pneu',     'acabamento', 'litro',  1,  3);
