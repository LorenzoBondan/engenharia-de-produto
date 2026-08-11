-- Tabela de conversas do assistente
CREATE TABLE IF NOT EXISTS tb_conversation
(
    id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id    integer                     NOT NULL,
    titulo        varchar(200),
    criado_em     timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversation_usuario FOREIGN KEY (usuario_id)
        REFERENCES tb_user (id) ON DELETE CASCADE
);

-- Índice para busca de conversas por usuário
CREATE INDEX IF NOT EXISTS idx_conversation_usuario
    ON tb_conversation (usuario_id);

-- Tabela de mensagens do assistente
CREATE TABLE IF NOT EXISTS tb_message
(
    id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conversation_id integer                     NOT NULL,
    role            varchar(20)                 NOT NULL,
    content         text                        NOT NULL,
    contexto_pagina varchar(200),
    criado_em       timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id)
        REFERENCES tb_conversation (id) ON DELETE CASCADE,
    CONSTRAINT chk_message_role CHECK (role IN ('user', 'assistant'))
);

-- Índice para busca de mensagens por conversa
CREATE INDEX IF NOT EXISTS idx_message_conversation
    ON tb_message (conversation_id);

-- Tabela de configurações do assistente por usuário
CREATE TABLE IF NOT EXISTS tb_assistant_config
(
    id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id    integer                     NOT NULL UNIQUE,
    habilitado    boolean                     NOT NULL DEFAULT true,
    tema          varchar(20)                 NOT NULL DEFAULT 'light',
    notificacoes  boolean                     NOT NULL DEFAULT true,
    criado_em     timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assistant_config_usuario FOREIGN KEY (usuario_id)
        REFERENCES tb_user (id) ON DELETE CASCADE,
    CONSTRAINT chk_assistant_config_tema CHECK (tema IN ('light', 'dark'))
);

-- Índice único para garantir uma config por usuário
CREATE UNIQUE INDEX IF NOT EXISTS idx_assistant_config_usuario
    ON tb_assistant_config (usuario_id);
