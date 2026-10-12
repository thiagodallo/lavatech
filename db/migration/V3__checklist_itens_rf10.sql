ALTER TABLE checklist_qualidade
    ADD COLUMN externa_sem_espuma      BOOLEAN NOT NULL,
    ADD COLUMN rodas_e_pneus_ok        BOOLEAN NOT NULL,
    ADD COLUMN vidros_sem_manchas      BOOLEAN NOT NULL,
    ADD COLUMN interior_aspirado       BOOLEAN NOT NULL,
    ADD COLUMN painel_e_portas_limpos  BOOLEAN NOT NULL,
    ADD COLUMN aromatizante_aplicado   BOOLEAN NOT NULL,
    ADD COLUMN sem_objetos_esquecidos  BOOLEAN NOT NULL,
    ADD COLUMN sem_danos_novos         BOOLEAN NOT NULL,
    ADD COLUMN resultado               VARCHAR(25) NOT NULL CHECK (
                                           resultado IN ('aprovado', 'aprovado_com_ressalva', 'reprovado')
                                       );
