package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.material.DMaterial;

import java.time.LocalDate;

public class MaterialFactory {

    public static DMaterial createDMaterial() {
        DMaterial material = new DMaterial();
        material.setCodigo(1);
        material.setDescricao("Descrição");
        material.setTipoMaterial(DTipoMaterialEnum.CHAPA_MDP);
        material.setImplantacao(LocalDate.of(3000,1,1));
        material.setPorcentagemPerda(12.0);
        material.setValor(10.0);
        material.setCor(new DCor(100));
        return material;
    }

    public static DMaterial createDuplicatedDMaterial(String duplicatedDescription) {
        DMaterial material = new DMaterial();
        material.setCodigo(2);
        material.setDescricao(duplicatedDescription);
        material.setTipoMaterial(DTipoMaterialEnum.CHAPA_MDP);
        material.setImplantacao(LocalDate.of(3000,1,1));
        material.setPorcentagemPerda(12.0);
        material.setValor(10.0);
        material.setCor(new DCor(100));
        return material;
    }

    public static DMaterial createNonExistingDMaterial(Integer nonExistingId) {
        DMaterial material = new DMaterial();
        material.setCodigo(nonExistingId);
        material.setDescricao("Descrição");
        material.setTipoMaterial(DTipoMaterialEnum.CHAPA_MDP);
        material.setImplantacao(LocalDate.of(3000,1,1));
        material.setPorcentagemPerda(12.0);
        material.setValor(10.0);
        material.setCor(new DCor(100));
        return material;
    }
}
