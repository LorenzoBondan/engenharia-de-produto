package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

import java.time.LocalDate;

public class PolietilenoFactory {

    public static DPolietileno createDPolietileno() {
        DPolietileno Polietileno = new DPolietileno();
        Polietileno.setCodigo(1);
        Polietileno.setDescricao("Descrição");
        Polietileno.setTipoMaterial(DTipoMaterialEnum.POLIETILENO);
        Polietileno.setImplantacao(LocalDate.of(3000,1,1));
        Polietileno.setPorcentagemPerda(12.0);
        Polietileno.setValor(10.0);
        Polietileno.setCor(new DCor(100));
        return Polietileno;
    }

    public static DPolietileno createDuplicatedDPolietileno(String duplicatedDescription) {
        DPolietileno Polietileno = new DPolietileno();
        Polietileno.setCodigo(2);
        Polietileno.setDescricao(duplicatedDescription);
        Polietileno.setTipoMaterial(DTipoMaterialEnum.POLIETILENO);
        Polietileno.setImplantacao(LocalDate.of(3000,1,1));
        Polietileno.setPorcentagemPerda(12.0);
        Polietileno.setValor(10.0);
        Polietileno.setCor(new DCor(100));
        return Polietileno;
    }

    public static DPolietileno createNonExistingDPolietileno(Integer nonExistingId) {
        DPolietileno Polietileno = new DPolietileno();
        Polietileno.setCodigo(nonExistingId);
        Polietileno.setDescricao("Descrição");
        Polietileno.setTipoMaterial(DTipoMaterialEnum.POLIETILENO);
        Polietileno.setImplantacao(LocalDate.of(3000,1,1));
        Polietileno.setPorcentagemPerda(12.0);
        Polietileno.setValor(10.0);
        Polietileno.setCor(new DCor(100));
        return Polietileno;
    }
}
