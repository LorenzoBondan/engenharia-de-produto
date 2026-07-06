package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.medidas.DMedidas;

public class MedidasFactory {

    public static DMedidas createDMedidas() {
        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);
        medidas.setAltura(1000);
        medidas.setEspessura(1000);
        medidas.setLargura(1000);
        return medidas;
    }

    public static DMedidas createDuplicatedDMedidas(Integer duplicatedInt) {
        DMedidas medidas = new DMedidas();
        medidas.setCodigo(2);
        medidas.setAltura(duplicatedInt);
        medidas.setEspessura(duplicatedInt);
        medidas.setLargura(duplicatedInt);
        return medidas;
    }

    public static DMedidas createNonExistingDMedidas(Integer nonExistingId) {
        DMedidas medidas = new DMedidas();
        medidas.setCodigo(nonExistingId);
        medidas.setAltura(1000);
        medidas.setEspessura(1000);
        medidas.setLargura(1000);
        return medidas;
    }
}
