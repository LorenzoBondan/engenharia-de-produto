package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;

public class GrupoMaquinaFactory {

    public static DGrupoMaquina createDGrupoMaquina() {
        DGrupoMaquina grupoMaquina = new DGrupoMaquina();
        grupoMaquina.setCodigo(1);
        grupoMaquina.setNome("Nome");
        return grupoMaquina;
    }

    public static DGrupoMaquina createDuplicatedDGrupoMaquina(String duplicatedDescription) {
        DGrupoMaquina grupoMaquina = new DGrupoMaquina();
        grupoMaquina.setCodigo(2);
        grupoMaquina.setNome(duplicatedDescription);
        return grupoMaquina;
    }

    public static DGrupoMaquina createNonExistingDGrupoMaquina(Integer nonExistingId) {
        DGrupoMaquina grupoMaquina = new DGrupoMaquina();
        grupoMaquina.setCodigo(nonExistingId);
        grupoMaquina.setNome("Nome");
        return grupoMaquina;
    }
}
