package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

public class RoteiroMaquinaFactory {

    public static DRoteiroMaquina createDRoteiroMaquina() {
        DRoteiroMaquina roteiroMaquina = new DRoteiroMaquina();
        roteiroMaquina.setCodigo(1);
        roteiroMaquina.setRoteiro(new DRoteiro(100));
        roteiroMaquina.setMaquina(new DMaquina(100));
        roteiroMaquina.setTempoMaquina(0.5);
        roteiroMaquina.setTempoHomem(0.5);
        roteiroMaquina.setUnidadeMedida("min");
        return roteiroMaquina;
    }

    public static DRoteiroMaquina createDuplicatedDRoteiroMaquina(Integer duplicatedId) {
        DRoteiroMaquina roteiroMaquina = new DRoteiroMaquina();
        roteiroMaquina.setCodigo(2);
        roteiroMaquina.setRoteiro(new DRoteiro(duplicatedId));
        roteiroMaquina.setMaquina(new DMaquina(duplicatedId));
        roteiroMaquina.setTempoMaquina(0.5);
        roteiroMaquina.setTempoHomem(0.5);
        roteiroMaquina.setUnidadeMedida("min");
        return roteiroMaquina;
    }

    public static DRoteiroMaquina createNonExistingDRoteiroMaquina(Integer nonExistingId) {
        DRoteiroMaquina roteiroMaquina = new DRoteiroMaquina();
        roteiroMaquina.setCodigo(nonExistingId);
        roteiroMaquina.setRoteiro(new DRoteiro(100));
        roteiroMaquina.setMaquina(new DMaquina(100));
        roteiroMaquina.setTempoMaquina(0.5);
        roteiroMaquina.setTempoHomem(0.5);
        roteiroMaquina.setUnidadeMedida("min");
        return roteiroMaquina;
    }
}
