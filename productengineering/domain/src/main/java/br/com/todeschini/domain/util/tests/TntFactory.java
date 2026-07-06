package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.tnt.DTnt;

import java.time.LocalDate;

public class TntFactory {

    public static DTnt createDTnt() {
        DTnt Tnt = new DTnt();
        Tnt.setCodigo(1);
        Tnt.setDescricao("Descrição");
        Tnt.setTipoMaterial(DTipoMaterialEnum.TNT);
        Tnt.setImplantacao(LocalDate.of(3000,1,1));
        Tnt.setPorcentagemPerda(12.0);
        Tnt.setValor(10.0);
        Tnt.setCor(new DCor(100));
        return Tnt;
    }

    public static DTnt createDuplicatedDTnt(String duplicatedDescription) {
        DTnt Tnt = new DTnt();
        Tnt.setCodigo(2);
        Tnt.setDescricao(duplicatedDescription);
        Tnt.setTipoMaterial(DTipoMaterialEnum.TNT);
        Tnt.setImplantacao(LocalDate.of(3000,1,1));
        Tnt.setPorcentagemPerda(12.0);
        Tnt.setValor(10.0);
        Tnt.setCor(new DCor(100));
        return Tnt;
    }

    public static DTnt createNonExistingDTnt(Integer nonExistingId) {
        DTnt Tnt = new DTnt();
        Tnt.setCodigo(nonExistingId);
        Tnt.setDescricao("Descrição");
        Tnt.setTipoMaterial(DTipoMaterialEnum.TNT);
        Tnt.setImplantacao(LocalDate.of(3000,1,1));
        Tnt.setPorcentagemPerda(12.0);
        Tnt.setValor(10.0);
        Tnt.setCor(new DCor(100));
        return Tnt;
    }
}
