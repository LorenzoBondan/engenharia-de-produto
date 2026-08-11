-- Inserir roles
INSERT INTO public.tb_role (id, authority) OVERRIDING SYSTEM VALUE VALUES (1, 'ROLE_OPERATOR');
INSERT INTO public.tb_role (id, authority) OVERRIDING SYSTEM VALUE VALUES (2, 'ROLE_ANALYST');
INSERT INTO public.tb_role (id, authority) OVERRIDING SYSTEM VALUE VALUES (3, 'ROLE_ADMIN');
SELECT setval('tb_role_id_seq', 3);

-- Inserir usuários
INSERT INTO public.tb_user (id, name, email, password) OVERRIDING SYSTEM VALUE VALUES (1, 'Alex', 'alex@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO public.tb_user (id, name, email, password) OVERRIDING SYSTEM VALUE VALUES (2, 'Maria', 'maria@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO public.tb_user (id, name, email, password) OVERRIDING SYSTEM VALUE VALUES (3, 'Bob', 'bob@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
SELECT setval('tb_user_id_seq', 3);

-- Inserir as relações entre os usuários e os roles
INSERT INTO tb_user_role (user_id, role_id) values (1,1);
INSERT INTO tb_user_role (user_id, role_id) values (2,1);
INSERT INTO tb_user_role (user_id, role_id) values (2,2);
INSERT INTO tb_user_role (user_id, role_id) values (2,3);
INSERT INTO tb_user_role (user_id, role_id) values (3,1);
INSERT INTO tb_user_role (user_id, role_id) values (3,2);

-- Inserir categoria componente
INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (1,'Frente', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente,descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (2,'Frente Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente,descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (3,'Lateral Esquerda Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente,descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (4,'Lateral Direita Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente,descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (5,'Fundo', 'ATIVO');
SELECT setval('tb_categoria_componente_cdcategoria_componente_seq', 5);

-- Inserir modelos
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (1,'Fresa', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (2,'Falsa', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (3,'Arch', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) OVERRIDING SYSTEM VALUE VALUES (4,'Piano', 'ATIVO');
SELECT setval('tb_modelo_cdmodelo_seq', 4);

-- Inserir cores
INSERT INTO tb_cor (cdcor, descricao, hexa) OVERRIDING SYSTEM VALUE VALUES (1, 'Minerale', 'F12398');
INSERT INTO tb_cor (cdcor, descricao, hexa) OVERRIDING SYSTEM VALUE VALUES (2, 'Prisma', 'ABCDE0');
INSERT INTO tb_cor (cdcor, descricao, hexa) OVERRIDING SYSTEM VALUE VALUES (3, 'Stone', 'CDE000');
INSERT INTO tb_cor (cdcor, descricao, hexa) OVERRIDING SYSTEM VALUE VALUES (4, 'Branca', 'FFF');
SELECT setval('tb_cor_cdcor_seq', 4);

-- Inserir medidas
INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura) OVERRIDING SYSTEM VALUE VALUES (1,1,1,1);
INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura) OVERRIDING SYSTEM VALUE VALUES (2,353,120,300);
INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura) OVERRIDING SYSTEM VALUE VALUES (3,300,120,18);
INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura) OVERRIDING SYSTEM VALUE VALUES (4,307,104,18);
SELECT setval('tb_medidas_cdmedidas_seq', 4);

-- Inserir grupos de máquinas
INSERT INTO tb_grupo_maquina (cdgrupo_maquina, nome) OVERRIDING SYSTEM VALUE VALUES (1, 'CNCs');
SELECT setval('tb_grupo_maquina_cdgrupo_maquina_seq', 1);

-- Inserir máquinas
INSERT INTO tb_maquina (cdmaquina, nome, formula, valor, cdgrupo_maquina) OVERRIDING SYSTEM VALUE VALUES (1,'CNC BIMA', '(M1+M2) / 1000 * 2', 50.0, 1);
SELECT setval('tb_maquina_cdmaquina_seq', 1);

-- Inserir roteiros
INSERT INTO tb_roteiro (cdroteiro, descricao, implantacao, data_final, valor) OVERRIDING SYSTEM VALUE VALUES (1, 'Não informado', '0001-01-01', '0001-01-01', 0);
SELECT setval('tb_roteiro_cdroteiro_seq', 1);

-- Inserir materiais
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) OVERRIDING SYSTEM VALUE VALUES (1, 'Chapa', 'MDP BP 18MM - MINERALE CZ COBALTO 2F', 1, '2024-01-01', 13, 10, 1, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) OVERRIDING SYSTEM VALUE VALUES (2, 'Chapa', 'MDP BP 18MM - PRISMA 2F', 1, '2024-01-01', 13, 10, 2, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) OVERRIDING SYSTEM VALUE VALUES (3, 'Chapa', 'MDP BP 18MM - STONE CHUMBO 2F', 1, '2024-01-01', 13, 10, 3, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) OVERRIDING SYSTEM VALUE VALUES (4, 'Chapa', 'MDF BP 18 MM 2F', 2, '2024-01-01', 10, 20, 4, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) OVERRIDING SYSTEM VALUE VALUES (5, 'Chapa', 'MDF BP 18 MM 1F', 2, '2024-01-01', 10, 20, 4, 18, 1, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, altura, espessura, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (6, 'FitaBorda', 'FITA BORDA PS 2107 - MINERALE CZ COBALTO', 3, '2024-01-01', 8.6, 30, 21, 7, 1,'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, altura, espessura, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (7, 'FitaBorda', 'FITA BORDA PS 2107 - PRISMA', 3, '2024-01-01', 8.6, 30, 21, 7, 2,'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, altura, espessura, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (8, 'FitaBorda', 'FITA BORDA PS 2107 - STONE CHUMBO', 3, '2024-01-01', 8.6, 30, 21, 7, 3,'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, gramatura, situacao) OVERRIDING SYSTEM VALUE VALUES (9, 'Cola', 'COLA PUR CQ 645', 4, '2024-01-01', 12, 15.0, 0.09, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (10, 'Cantoneira', 'Cantoneira 2MM', 5, '2024-01-01', 0, 5.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (11, 'Tnt', 'TNT 1', 6, '2024-01-01', 0, 25.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (12, 'Polietileno', 'Polietileno 1', 7, '2024-01-01', 15, 50.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, gramatura, situacao) OVERRIDING SYSTEM VALUE VALUES (13, 'Plastico', 'Plastico 1', 8, '2024-01-01', 15, 50.0, 0.5, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, tipo_pintura, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (14, 'Pintura', 'Pintura Acetinada Minerale', 9, '2024-01-01', 12, 75.0, 1, 1, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, tipo_pintura, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (15, 'Pintura', 'Pintura Acetinada Prisma', 9, '2024-01-01', 12, 75.0, 1, 2, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (16, 'PinturaBordaFundo', 'Pintura de Borda de Fundo Padrão', 10, '2024-01-01', 10, 80.0, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (17, 'Poliester', 'Poliester Padrão', 11, '2024-01-01', 20, 100.0, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (18, 'Baguete', 'Baguete Padrão', 12, '2024-01-01', 20, 100.0, 'ATIVO');
SELECT setval('tb_material_cdmaterial_seq', 18);

-- Inserir acessórios
INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (1, 'ACAB FTE GAV ALUM TRANSLUCIDO 810 MM', 1, '2024-01-01',  50.0, 'ATIVO');
INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, situacao) OVERRIDING SYSTEM VALUE VALUES (2, 'ACESSÓRIO GAVETA ALUM H-90 P-500', 1, '2024-01-01', 50.0, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (3,'VIDRO TEMPERADO MINERALE', 1, '2024-01-01', 200.0, 1, 'ATIVO');
INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (4,'VIDRO TEMPERADO PRISMA', 1, '2024-01-01', 200.0, 2, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (5,'PARAFUSO 18 MM BRANCO', 1, '2024-01-01', 2.0, 4, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) OVERRIDING SYSTEM VALUE VALUES (6,'ESQUADRETA 123', 1, '2024-01-01', 50.0, 4, 'ATIVO');
SELECT setval('tb_acessorio_cdacessorio_seq', 6);

-- Inserir pai
INSERT INTO tb_pai (cdpai, cdmodelo, cdcategoria_componente, descricao, bordas_comprimento, bordas_largura, numero_cantoneiras, tnt_uma_face, plastico_acima, plastico_adicional, largura_plastico, faces, especial, tipo_pintura) OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'Frente Teste', 1, 1, 4, false, true, 0, 400, 2, false, 1);
SELECT setval('tb_pai_cdpai_seq', 1);

-- Inserir filho
INSERT INTO tb_filho (cdfilho, descricao, cdpai, cdcor, cdmedidas, cdroteiro, unidade_medida, implantacao, valor, tipo) OVERRIDING SYSTEM VALUE VALUES (1, 'Teste', 1, 1, 1, 1, 'UN', null, null, 1);
SELECT setval('tb_filho_cdfilho_seq', 1);

-- Inserir material usado
INSERT INTO tb_material_usado (cdfilho, cdmaterial, valor, quantidade_liquida, quantidade_bruta, unidade_medida, dtype) VALUES (1,1, 10, 1, 1, 'M', 'ChapaUsada');
SELECT setval('tb_material_usado_cdmaterial_usado_seq', 1);

-- Inserir binário
INSERT INTO public.tb_binario (cdbinario, bytes) OVERRIDING SYSTEM VALUE VALUES (1,decode('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', 'base64'));
SELECT setval('tb_binario_cdbinario_seq', 2);

-- Inserir anexo
INSERT INTO public.tb_anexo (cdanexo, cdbinario, nome, mime_type) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Logo.png', 'image/png');
SELECT setval('tb_anexo_cdanexo_seq', 2);

-- Inserir anexo de usuário
INSERT INTO public.tb_user_anexo (user_id, cdanexo) VALUES (1,1);