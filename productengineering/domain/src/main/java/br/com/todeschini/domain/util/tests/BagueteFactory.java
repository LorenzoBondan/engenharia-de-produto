package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.baguete.DBaguete;
import br.com.todeschini.domain.business.publico.cor.DCor;

import java.time.LocalDate;

public class BagueteFactory {

    public static DBaguete createDBaguete() {
        DBaguete Baguete = new DBaguete();
        Baguete.setCodigo(1);
        Baguete.setDescricao("Descrição");
        Baguete.setTipoMaterial(DTipoMaterialEnum.BAGUETE);
        Baguete.setImplantacao(LocalDate.of(3000,1,1));
        Baguete.setPorcentagemPerda(12.0);
        Baguete.setValor(10.0);
        Baguete.setCor(new DCor(100));
        return Baguete;
    }

    public static DBaguete createDuplicatedDBaguete(String duplicatedDescription) {
        DBaguete Baguete = new DBaguete();
        Baguete.setCodigo(2);
        Baguete.setDescricao(duplicatedDescription);
        Baguete.setTipoMaterial(DTipoMaterialEnum.BAGUETE);
        Baguete.setImplantacao(LocalDate.of(3000,1,1));
        Baguete.setPorcentagemPerda(12.0);
        Baguete.setValor(10.0);
        Baguete.setCor(new DCor(100));
        return Baguete;
    }

    public static DBaguete createNonExistingDBaguete(Integer nonExistingId) {
        DBaguete Baguete = new DBaguete();
        Baguete.setCodigo(nonExistingId);
        Baguete.setDescricao("Descrição");
        Baguete.setTipoMaterial(DTipoMaterialEnum.BAGUETE);
        Baguete.setImplantacao(LocalDate.of(3000,1,1));
        Baguete.setPorcentagemPerda(12.0);
        Baguete.setValor(10.0);
        Baguete.setCor(new DCor(100));
        return Baguete;
    }
}
