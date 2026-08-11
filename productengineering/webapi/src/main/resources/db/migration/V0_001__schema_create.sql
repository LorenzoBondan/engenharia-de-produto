CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS public.tb_lixeira
(
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nometabela character varying(50),
    data       timestamp,
    entidadeid jsonb,
    usuario    character varying(50),
    situacao   character varying(8),
    tabela     character varying(200),
    CONSTRAINT uk_entidadeid UNIQUE (entidadeid)
);

CREATE TABLE IF NOT EXISTS public.t_history
(
    id         integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tstamp     timestamp without time zone DEFAULT now(),
    schemaname text,
    tabname    text,
    operation  text,
    old_val    jsonb,
    diff       jsonb
);

CREATE OR REPLACE FUNCTION change_trigger()
    RETURNS TRIGGER AS $$
DECLARE
    diff JSONB;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF to_jsonb(OLD) != to_jsonb(NEW) THEN
            diff := (
                SELECT jsonb_object_agg(key, value)
                FROM jsonb_each(to_jsonb(NEW))
                WHERE to_jsonb(OLD) -> key IS DISTINCT FROM value
            );

            INSERT INTO public.t_history (tabname, schemaname, operation, old_val, diff)
            VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, to_jsonb(OLD), diff);
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.t_history (tabname, schemaname, operation, old_val)
        VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.t_history (tabname, schemaname, operation, old_val)
        VALUES (TG_RELNAME, TG_TABLE_SCHEMA, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.tb_role
(
    id        integer generated always as identity primary key,
    authority varchar(255) not null
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_role
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_user
(
    id            integer generated always as identity primary key,
    name          varchar(50)                 not null,
    email         varchar(50)                 not null unique,
    password      varchar(200)                not null,
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_user
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_user_role
(
    user_id integer not null references public.tb_user (id),
    role_id integer not null references public.tb_role (id),
    primary key (user_id, role_id)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_user_role
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_cor
(
    cdcor         integer generated always as identity primary key,
    descricao     varchar(50)                 not null,
    hexa          varchar(10),
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_cor
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_modelo
(
    cdmodelo      integer generated always as identity primary key,
    descricao     varchar(50)                 not null,
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_modelo
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_categoria_componente
(
    cdcategoria_componente integer generated always as identity primary key,
    descricao              varchar(50)                 not null,
    criadopor              character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem               timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor          character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem           timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao               character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_categoria_componente
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_medidas
(
    cdmedidas     integer generated always as identity primary key,
    altura        integer                     not null,
    largura       integer                     not null,
    espessura     integer                     not null,
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT unique_medidas UNIQUE (altura, largura, espessura)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_medidas
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_pai
(
    cdpai                  integer generated always as identity primary key,
    cdcategoria_componente integer references public.tb_categoria_componente (cdcategoria_componente) on update cascade on delete cascade not null,
    cdmodelo               integer references public.tb_modelo (cdmodelo) on update cascade on delete cascade                             not null,
    descricao              varchar(50)                                                                                                    not null,
    bordas_comprimento     integer,
    bordas_largura         integer,
    especial               boolean,
    faces                  integer,
    largura_plastico       integer,
    numero_cantoneiras     integer,
    plastico_acima         boolean,
    plastico_adicional     double precision,
    tipo_pintura           integer,
    tnt_uma_face           boolean,
    criadopor              character varying(50)                                                                                          NOT NULL DEFAULT 'postgres',
    criadoem               timestamp without time zone                                                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor          character varying(50)                                                                                          NOT NULL DEFAULT 'postgres',
    modificadoem           timestamp without time zone                                                                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao               character varying(8)                                                                                           NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_pai
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_grupo_maquina
(
    cdgrupo_maquina integer generated always as identity primary key,
    nome            varchar(50)                 not null,
    criadopor       character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem        timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor   character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem    timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao        character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_grupo_maquina
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_maquina
(
    cdmaquina       integer generated always as identity primary key,
    cdgrupo_maquina integer references public.tb_grupo_maquina (cdgrupo_maquina) on update cascade on delete cascade not null,
    nome            varchar(50)                                                                                      not null,
    formula         varchar(150)                                                                                     not null,
    valor           double precision,
    criadopor       character varying(50)                                                                            NOT NULL DEFAULT 'postgres',
    criadoem        timestamp without time zone                                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor   character varying(50)                                                                            NOT NULL DEFAULT 'postgres',
    modificadoem    timestamp without time zone                                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao        character varying(8)                                                                             NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_maquina
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_roteiro
(
    cdroteiro     integer generated always as identity primary key,
    descricao     varchar(100),
    implantacao   date,
    data_final    date,
    valor         double precision,
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_roteiro
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_roteiro_maquina
(
    cdroteiro_maquina integer generated always as identity primary key,
    cdroteiro         integer references public.tb_roteiro (cdroteiro) on update cascade on delete cascade not null,
    cdmaquina         integer references public.tb_maquina (cdmaquina) on update cascade on delete cascade not null,
    tempo_homem       double precision,
    tempo_maquina     double precision,
    unidade_medida    varchar(10),
    criadopor         character varying(50)                                                                NOT NULL DEFAULT 'postgres',
    criadoem          timestamp without time zone                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor     character varying(50)                                                                NOT NULL DEFAULT 'postgres',
    modificadoem      timestamp without time zone                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao          character varying(8)                                                                 NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT unique_roteiro_maquina UNIQUE (cdroteiro, cdmaquina)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_roteiro_maquina
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_filho
(
    cdfilho        integer generated always as identity primary key,
    cdpai          integer references public.tb_pai (cdpai) on update cascade on delete cascade         not null,
    cdmedidas      integer references public.tb_medidas (cdmedidas) on update cascade on delete cascade not null,
    cdcor          integer references public.tb_cor (cdcor) on update cascade on delete cascade         not null,
    cdroteiro      integer references public.tb_roteiro (cdroteiro) on update cascade on delete cascade,
    descricao      varchar(50)                                                                          not null,
    valor          double precision,
    implantacao    date,
    tipo           integer,
    unidade_medida varchar(10),
    criadopor      character varying(50)                                                                NOT NULL DEFAULT 'postgres',
    criadoem       timestamp without time zone                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor  character varying(50)                                                                NOT NULL DEFAULT 'postgres',
    modificadoem   timestamp without time zone                                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao       character varying(8)                                                                 NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_filho
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_item_filho
(
    item_id  integer references public.tb_filho (cdfilho) on update cascade on delete cascade not null,
    filho_id integer references public.tb_filho (cdfilho) on update cascade on delete cascade not null,
    primary key (item_id, filho_id)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_item_filho
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_material
(
    cdmaterial        integer generated always as identity primary key,
    dtype             varchar(50)                 not null,
    descricao         varchar(50)                 not null,
    cdcor             integer references public.tb_cor (cdcor) on update cascade on delete cascade,
    implantacao       date,
    porcentagem_perda double precision            not null,
    tipo_material     integer                     not null,
    valor             double precision            not null,
    espessura         integer,
    faces             integer,
    gramatura         double precision,
    altura            integer,
    tipo_pintura      integer,
    criadopor         character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem          timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao          character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_material
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_material_usado
(
    cdmaterial_usado   integer generated always as identity primary key,
    dtype              varchar(50)                                                                            not null,
    cdmaterial         integer references public.tb_material (cdmaterial) on update cascade on delete cascade not null,
    cdfilho            integer references public.tb_filho (cdfilho) on update cascade on delete cascade       not null,
    quantidade_bruta   double precision,
    quantidade_liquida double precision,
    valor              double precision,
    unidade_medida     varchar(10),
    criadopor          character varying(50)                                                                  NOT NULL DEFAULT 'postgres',
    criadoem           timestamp without time zone                                                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor      character varying(50)                                                                  NOT NULL DEFAULT 'postgres',
    modificadoem       timestamp without time zone                                                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao           character varying(8)                                                                   NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT unique_material_usado UNIQUE (cdmaterial, cdfilho)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_material_usado
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_acessorio
(
    cdacessorio   integer generated always as identity primary key,
    descricao     varchar(50)                 not null,
    implantacao   date,
    valor         double precision            not null,
    cdcor         integer references public.tb_cor (cdcor) on update cascade on delete cascade,
    cdmedidas     integer references public.tb_medidas (cdmedidas) on update cascade on delete cascade,
    criadopor     character varying(50)       NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_acessorio
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_acessorio_usado
(
    cdacessorio_usado integer generated always as identity primary key,
    cdacessorio       integer references public.tb_acessorio (cdacessorio) on update cascade on delete cascade not null,
    cdfilho           integer references public.tb_filho (cdfilho) on update cascade on delete cascade         not null,
    quantidade        integer                                                                                  not null,
    valor             double precision                                                                         not null,
    unidade_medida    varchar(10),
    criadopor         character varying(50)                                                                    NOT NULL DEFAULT 'postgres',
    criadoem          timestamp without time zone                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor     character varying(50)                                                                    NOT NULL DEFAULT 'postgres',
    modificadoem      timestamp without time zone                                                              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao          character varying(8)                                                                     NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT unique_acessorio_usado UNIQUE (cdacessorio, cdfilho)
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_acessorio_usado
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE public.tb_binario
(
    cdbinario     integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bytes         bytea                       NOT NULL,
    criadopor     character varying(50)       NOT NULL DEFAULT 'metaway',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'metaway',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_binario
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE public.tb_anexo
(
    cdanexo       integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cdbinario     integer                     REFERENCES public.tb_binario (cdbinario) ON UPDATE CASCADE ON DELETE SET NULL,
    nome          CHARACTER VARYING(100)      NOT NULL,
    mime_type     CHARACTER VARYING(100)      NOT NULL,
    criadopor     character varying(50)       NOT NULL DEFAULT 'metaway',
    criadoem      timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)       NOT NULL DEFAULT 'metaway',
    modificadoem  timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)        NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_anexo
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();

CREATE TABLE IF NOT EXISTS public.tb_user_anexo
(
    cduser_anexo  integer generated always as identity primary key,
    user_id       integer references public.tb_user (id) on update cascade on delete cascade       not null,
    cdanexo       integer references public.tb_anexo (cdanexo) on update cascade on delete cascade not null,
    criadopor     character varying(50)                                                            NOT NULL DEFAULT 'postgres',
    criadoem      timestamp without time zone                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modificadopor character varying(50)                                                            NOT NULL DEFAULT 'postgres',
    modificadoem  timestamp without time zone                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    situacao      character varying(8)                                                             NOT NULL DEFAULT 'ATIVO'
);

CREATE TRIGGER change_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON public.tb_user_anexo
    FOR EACH ROW
EXECUTE FUNCTION change_trigger();