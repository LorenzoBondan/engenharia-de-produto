package br.com.todeschini.domain.util.tests;


import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cola.DCola;

import java.time.LocalDate;

public class ColaFactory {

    public static DCola createDCola() {
        DCola cola = new DCola();
        cola.setCodigo(1);
        cola.setDescricao("Descrição");
        cola.setTipoMaterial(DTipoMaterialEnum.COLA);
        cola.setImplantacao(LocalDate.of(3000,1,1));
        cola.setPorcentagemPerda(12.0);
        cola.setValor(10.0);
        cola.setGramatura(0.09);
        return cola;
    }

    public static DCola createDuplicatedDCola(String duplicatedDescription) {
        DCola cola = new DCola();
        cola.setCodigo(2);
        cola.setDescricao(duplicatedDescription);
        cola.setTipoMaterial(DTipoMaterialEnum.COLA);
        cola.setImplantacao(LocalDate.of(3000,1,1));
        cola.setPorcentagemPerda(12.0);
        cola.setValor(10.0);
        cola.setGramatura(0.09);
        return cola;
    }

    public static DCola createNonExistingDCola(Integer nonExistingId) {
        DCola cola = new DCola();
        cola.setCodigo(nonExistingId);
        cola.setDescricao("Descrição");
        cola.setTipoMaterial(DTipoMaterialEnum.COLA);
        cola.setImplantacao(LocalDate.of(3000,1,1));
        cola.setPorcentagemPerda(12.0);
        cola.setValor(10.0);
        cola.setGramatura(0.09);
        return cola;
    }
}
