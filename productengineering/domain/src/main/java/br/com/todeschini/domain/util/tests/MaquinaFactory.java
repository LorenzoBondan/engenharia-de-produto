package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;

public class MaquinaFactory {

    public static DMaquina createDMaquina() {
        DMaquina maquina = new DMaquina();
        maquina.setCodigo(1);
        maquina.setNome("Nome");
        maquina.setFormula("(M1 + M2) / 1000 * 2");
        maquina.setValor(50.0);
        maquina.setGrupoMaquina(new DGrupoMaquina(100));
        return maquina;
    }

    public static DMaquina createDuplicatedDMaquina(String duplicatedDescription) {
        DMaquina maquina = new DMaquina();
        maquina.setCodigo(2);
        maquina.setNome(duplicatedDescription);
        maquina.setFormula("(M1 + M2) / 1000 * 2");
        maquina.setValor(50.0);
        maquina.setGrupoMaquina(new DGrupoMaquina(100));
        return maquina;
    }

    public static DMaquina createNonExistingDMaquina(Integer nonExistingId) {
        DMaquina maquina = new DMaquina();
        maquina.setCodigo(nonExistingId);
        maquina.setNome("Nome");
        maquina.setFormula("(M1 + M2) / 1000 * 2");
        maquina.setValor(50.0);
        maquina.setGrupoMaquina(new DGrupoMaquina(100));
        return maquina;
    }
}
