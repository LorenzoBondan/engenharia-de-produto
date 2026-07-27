package br.com.todeschini.persistence.util;

import br.com.todeschini.persistence.entities.publico.*;
import lombok.Getter;

import java.util.Map;

/**
 * Classe para mapear os nomes das dependências no banco para suas respectivas entidades
 */
@Getter
public enum AttributeMappings {

    BINARIO(Map.of(
    )),
    ANEXO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdbinario", Binario.class
            ),
            BINARIO.getMappings()
    )),
    COR(Map.of(
    )),
    MODELO(Map.of(
    )),
    CATEGORIACOMPONENTE(Map.of(
    )),
    USER(Map.of(
    )),
    MEDIDAS(Map.of(
    )),
    PAI(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdmodelo", Modelo.class,
                    "cdcategoria_componente", CategoriaComponente.class
            ),
            MODELO.getMappings(),
            CATEGORIACOMPONENTE.getMappings()
    )),
    GRUPOMAQUINA(Map.of(
    )),
    MAQUINA(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdgrupo_maquina", GrupoMaquina.class
            ),
            GRUPOMAQUINA.getMappings()
    )),
    ROTEIRO(Map.of(
    )),
    ROTEIROMAQUINA(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdroteiro", Roteiro.class,
                    "cdmaquina", Maquina.class
            ),
            ROTEIRO.getMappings(),
            MAQUINA.getMappings()
    )),
    FILHO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdpai", Pai.class,
                    "cdcor", Cor.class,
                    "cdmedidas", Medidas.class,
                    "cdroteiro", Roteiro.class
            ),
            PAI.getMappings(),
            COR.getMappings(),
            MEDIDAS.getMappings(),
            ROTEIRO.getMappings()
    )),
    MATERIAL(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdcor", Cor.class
            ),
            COR.getMappings()
    )),
    MATERIALUSADO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdfilho", Filho.class,
                    "cdmaterial", Material.class

            ),
            FILHO.getMappings(),
            MATERIAL.getMappings()
    )),
    ACESSORIO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdmedidas", Medidas.class,
                    "cdcor", Cor.class
            ),
            MEDIDAS.getMappings(),
            COR.getMappings()
    )),
    ACESSORIOUSADO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "cdacessorio", Acessorio.class,
                    "cdfilho", Filho.class
            ),
            ACESSORIO.getMappings(),
            FILHO.getMappings()
    )),
    USERANEXO(AttributeMappingsUtil.combineMappings(
            Map.of(
                    "user_id", User.class,
                    "cdanexo", Anexo.class
            ),
            USER.getMappings(),
            ANEXO.getMappings()
    )),
    ;

    private final Map<String, Class<?>> mappings;

    AttributeMappings(Map<String, Class<?>> mappings) {
        this.mappings = mappings;
    }
}
