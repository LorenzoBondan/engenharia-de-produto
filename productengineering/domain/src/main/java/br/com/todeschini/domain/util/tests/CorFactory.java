package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.cor.DCor;

public class CorFactory {

    public static DCor createDCor() {
        DCor cor = new DCor();
        cor.setCodigo(1);
        cor.setDescricao("Descrição");
        cor.setHexa("FFF");
        return cor;
    }

    public static DCor createDuplicatedDCor(String duplicatedDescription) {
        DCor cor = new DCor();
        cor.setCodigo(2);
        cor.setDescricao(duplicatedDescription);
        cor.setHexa("FFF");
        return cor;
    }

    public static DCor createNonExistingDCor(Integer nonExistingId) {
        DCor cor = new DCor();
        cor.setCodigo(nonExistingId);
        cor.setDescricao("Descrição");
        cor.setHexa("FFF");
        return cor;
    }
}
