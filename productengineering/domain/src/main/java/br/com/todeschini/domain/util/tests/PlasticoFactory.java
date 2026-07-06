package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;

import java.time.LocalDate;

public class PlasticoFactory {

    public static DPlastico createDPlastico() {
        DPlastico Plastico = new DPlastico();
        Plastico.setCodigo(1);
        Plastico.setDescricao("Descrição");
        Plastico.setTipoMaterial(DTipoMaterialEnum.PLASTICO);
        Plastico.setImplantacao(LocalDate.of(3000,1,1));
        Plastico.setPorcentagemPerda(12.0);
        Plastico.setValor(10.0);
        Plastico.setCor(new DCor(100));
        Plastico.setGramatura(0.5);
        return Plastico;
    }

    public static DPlastico createDuplicatedDPlastico(String duplicatedDescription) {
        DPlastico Plastico = new DPlastico();
        Plastico.setCodigo(2);
        Plastico.setDescricao(duplicatedDescription);
        Plastico.setTipoMaterial(DTipoMaterialEnum.PLASTICO);
        Plastico.setImplantacao(LocalDate.of(3000,1,1));
        Plastico.setPorcentagemPerda(12.0);
        Plastico.setValor(10.0);
        Plastico.setCor(new DCor(100));
        Plastico.setGramatura(0.5);
        return Plastico;
    }

    public static DPlastico createNonExistingDPlastico(Integer nonExistingId) {
        DPlastico Plastico = new DPlastico();
        Plastico.setCodigo(nonExistingId);
        Plastico.setDescricao("Descrição");
        Plastico.setTipoMaterial(DTipoMaterialEnum.PLASTICO);
        Plastico.setImplantacao(LocalDate.of(3000,1,1));
        Plastico.setPorcentagemPerda(12.0);
        Plastico.setValor(10.0);
        Plastico.setCor(new DCor(100));
        Plastico.setGramatura(0.5);
        return Plastico;
    }
}
