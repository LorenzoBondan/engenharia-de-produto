package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;

import java.time.LocalDate;

public class PoliesterFactory {

    public static DPoliester createDPoliester() {
        DPoliester Poliester = new DPoliester();
        Poliester.setCodigo(1);
        Poliester.setDescricao("Descrição");
        Poliester.setTipoMaterial(DTipoMaterialEnum.POLIESTER);
        Poliester.setImplantacao(LocalDate.of(3000,1,1));
        Poliester.setPorcentagemPerda(12.0);
        Poliester.setValor(10.0);
        Poliester.setCor(new DCor(100));
        return Poliester;
    }

    public static DPoliester createDuplicatedDPoliester(String duplicatedDescription) {
        DPoliester Poliester = new DPoliester();
        Poliester.setCodigo(2);
        Poliester.setDescricao(duplicatedDescription);
        Poliester.setTipoMaterial(DTipoMaterialEnum.POLIESTER);
        Poliester.setImplantacao(LocalDate.of(3000,1,1));
        Poliester.setPorcentagemPerda(12.0);
        Poliester.setValor(10.0);
        Poliester.setCor(new DCor(100));
        return Poliester;
    }

    public static DPoliester createNonExistingDPoliester(Integer nonExistingId) {
        DPoliester Poliester = new DPoliester();
        Poliester.setCodigo(nonExistingId);
        Poliester.setDescricao("Descrição");
        Poliester.setTipoMaterial(DTipoMaterialEnum.POLIESTER);
        Poliester.setImplantacao(LocalDate.of(3000,1,1));
        Poliester.setPorcentagemPerda(12.0);
        Poliester.setValor(10.0);
        Poliester.setCor(new DCor(100));
        return Poliester;
    }
}
