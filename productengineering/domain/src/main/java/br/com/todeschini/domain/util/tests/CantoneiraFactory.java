package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;
import br.com.todeschini.domain.business.publico.cor.DCor;

import java.time.LocalDate;

public class CantoneiraFactory {

    public static DCantoneira createDCantoneira() {
        DCantoneira Cantoneira = new DCantoneira();
        Cantoneira.setCodigo(1);
        Cantoneira.setDescricao("Descrição");
        Cantoneira.setTipoMaterial(DTipoMaterialEnum.CANTONEIRA);
        Cantoneira.setImplantacao(LocalDate.of(3000,1,1));
        Cantoneira.setPorcentagemPerda(12.0);
        Cantoneira.setValor(10.0);
        Cantoneira.setCor(new DCor(100));
        return Cantoneira;
    }

    public static DCantoneira createDuplicatedDCantoneira(String duplicatedDescription) {
        DCantoneira Cantoneira = new DCantoneira();
        Cantoneira.setCodigo(2);
        Cantoneira.setDescricao(duplicatedDescription);
        Cantoneira.setTipoMaterial(DTipoMaterialEnum.CANTONEIRA);
        Cantoneira.setImplantacao(LocalDate.of(3000,1,1));
        Cantoneira.setPorcentagemPerda(12.0);
        Cantoneira.setValor(10.0);
        Cantoneira.setCor(new DCor(100));
        return Cantoneira;
    }

    public static DCantoneira createNonExistingDCantoneira(Integer nonExistingId) {
        DCantoneira Cantoneira = new DCantoneira();
        Cantoneira.setCodigo(nonExistingId);
        Cantoneira.setDescricao("Descrição");
        Cantoneira.setTipoMaterial(DTipoMaterialEnum.CANTONEIRA);
        Cantoneira.setImplantacao(LocalDate.of(3000,1,1));
        Cantoneira.setPorcentagemPerda(12.0);
        Cantoneira.setValor(10.0);
        Cantoneira.setCor(new DCor(100));
        return Cantoneira;
    }
}
