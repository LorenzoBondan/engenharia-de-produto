INSERT INTO tb_user (id, name, email, password) VALUES (1, 'Alex', 'alex@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO tb_user (id, name, email, password) VALUES (2, 'Maria', 'maria@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO tb_user (id, name, email, password) VALUES (3, 'Bob', 'bob@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');

INSERT INTO tb_role (id, authority) VALUES (1, 'ROLE_OPERATOR');
INSERT INTO tb_role (id, authority) VALUES (2, 'ROLE_ANALYST');
INSERT INTO tb_role (id, authority) VALUES (3, 'ROLE_ADMIN');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 3);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 2);

INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) VALUES (1, 'Frente', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) VALUES (2, 'Frente Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) VALUES (3, 'Lateral Esquerda Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) VALUES (4, 'Lateral Direita Gaveta', 'ATIVO');
INSERT INTO tb_categoria_componente (cdcategoria_componente, descricao, situacao) VALUES (5, 'Fundo', 'ATIVO');

INSERT INTO tb_modelo (cdmodelo, descricao, situacao) VALUES (1, 'Fresa', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) VALUES (2, 'Falsa', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) VALUES (3, 'Arch', 'ATIVO');
INSERT INTO tb_modelo (cdmodelo, descricao, situacao) VALUES (4, 'Piano', 'ATIVO');

INSERT INTO tb_cor (cdcor, descricao, hexa, situacao) VALUES (1, 'MINERALE', 'F12345','ATIVO');
INSERT INTO tb_cor (cdcor, descricao, hexa, situacao) VALUES (2, 'PRISMA', 'F123FF','ATIVO');
INSERT INTO tb_cor (cdcor, descricao, hexa, situacao) VALUES (3, 'STONE', 'F12896','ATIVO');
INSERT INTO tb_cor (cdcor, descricao, hexa, situacao) VALUES (4, 'BRANCA', 'FFF','ATIVO');

INSERT INTO tb_grupo_maquina (cdgrupo_maquina, nome, situacao) VALUES (1, 'CNCs', 'ATIVO');

INSERT INTO tb_maquina (cdmaquina, nome, formula, valor, cdgrupo_maquina) VALUES (1, 'CNC BIMA', '(M1+M2) / 1000 * 2', 50.0, 1);

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) VALUES (1, 'Chapa', 'MDP BP 18MM - MINERALE CZ COBALTO 2F', 1, '2024-01-01', 13, 10, 1, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) VALUES (2, 'Chapa', 'MDP BP 18MM - PRISMA 2F', 1, '2024-01-01', 13, 10, 2, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) VALUES (3, 'Chapa', 'MDP BP 18MM - STONE CHUMBO 2F', 1, '2024-01-01', 13, 10, 3, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) VALUES (4, 'Chapa', 'MDF BP 18 MM 2F', 2, '2024-01-01', 10, 20, 4, 18, 2, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, espessura, faces, situacao) VALUES (5, 'Chapa', 'MDF BP 18 MM 1F', 2, '2024-01-01', 10, 20, 4, 18, 1, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, altura, espessura, situacao) VALUES (6, 'FitaBorda', 'FITA BORDA PS 2107 - MINERALE CZ COBALTO', 3, '2024-01-01', 8.6, 30, 1, 21, 7, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, altura, espessura, situacao) VALUES (7, 'FitaBorda', 'FITA BORDA PS 2107 - PRISMA', 3, '2024-01-01', 8.6, 30, 2, 21, 7, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, cdcor, altura, espessura, situacao) VALUES (8, 'FitaBorda', 'FITA BORDA PS 2107 - STONE CHUMBO', 3, '2024-01-01', 8.6, 30, 3, 21, 7, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, gramatura, situacao) VALUES (9, 'Cola', 'COLA PUR CQ 645', 4, '2024-01-01', 12, 15.0, 0.09, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) VALUES (10, 'Cantoneira', 'Cantoneira 2MM', 5, '2024-01-01', 0, 5.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) VALUES (11, 'Tnt', 'TNT 1', 6, '2024-01-01', 0, 25.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) VALUES (12, 'Polietileno', 'Polietileno 1', 7, '2024-01-01', 15, 50.0, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, gramatura, situacao) VALUES (13, 'Plastico', 'Plastico 1', 8, '2024-01-01', 15, 50.0, 0.5, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, tipo_pintura, cdcor, situacao) VALUES (14, 'Pintura', 'Pintura Acetinada Minerale', 9, '2024-01-01', 12, 75.0, 1, 1, 'ATIVO');
INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, tipo_pintura, cdcor, situacao) VALUES (15, 'Pintura', 'Pintura Acetinada Prisma', 9, '2024-01-01', 12, 75.0, 1, 2, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) VALUES (16, 'PinturaBordaFundo', 'Pintura de Borda de Fundo Padrão', 10, '2024-01-01', 10, 80.0, 'ATIVO');

INSERT INTO tb_material (cdmaterial, dtype, descricao, tipo_material, implantacao, porcentagem_perda, valor, situacao) VALUES (17, 'Poliester', 'Poliester Padrão', 11, '2024-01-01', 20, 100.0, 'ATIVO');

INSERT INTO tb_medidas (cdmedidas, altura, largura, espessura, situacao) VALUES (1, 1, 1, 1, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, situacao) VALUES (1, 'ACAB FTE GAV ALUM TRANSLUCIDO 810 MM', 1, '2024-01-01',  50.0, 'ATIVO');
INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, situacao) VALUES (2, 'ACESSÓRIO GAVETA ALUM H-90 P-500', 1, '2024-01-01', 50.0, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) VALUES (3, 'VIDRO TEMPERADO MINERALE', 1, '2024-01-01', 200.0, 1, 'ATIVO');
INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) VALUES (4, 'VIDRO TEMPERADO PRISMA', 1, '2024-01-01', 200.0, 2, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) VALUES (5, 'PARAFUSO 18 MM BRANCO', 1, '2024-01-01', 2.0, 4, 'ATIVO');

INSERT INTO tb_acessorio (cdacessorio, descricao, cdmedidas, implantacao, valor, cdcor, situacao) VALUES (6, 'ESQUADRETA 123', 1, '2024-01-01', 50.0, 4, 'ATIVO');

