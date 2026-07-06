package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;

import java.time.LocalDate;

public class FitaBordaFactory {

    public static DFitaBorda createDFitaBorda() {
        DFitaBorda fitaBorda = new DFitaBorda();
        fitaBorda.setCodigo(1);
        fitaBorda.setDescricao("Descrição");
        fitaBorda.setTipoMaterial(DTipoMaterialEnum.FITA_BORDA);
        fitaBorda.setImplantacao(LocalDate.of(3000,1,1));
        fitaBorda.setPorcentagemPerda(12.0);
        fitaBorda.setValor(10.0);
        fitaBorda.setAltura(21);
        fitaBorda.setEspessura(7);
        return fitaBorda;
    }

    public static DFitaBorda createDuplicatedDFitaBorda(String duplicatedDescription) {
        DFitaBorda fitaBorda = new DFitaBorda();
        fitaBorda.setCodigo(2);
        fitaBorda.setDescricao(duplicatedDescription);
        fitaBorda.setTipoMaterial(DTipoMaterialEnum.FITA_BORDA);
        fitaBorda.setImplantacao(LocalDate.of(3000,1,1));
        fitaBorda.setPorcentagemPerda(12.0);
        fitaBorda.setValor(10.0);
        fitaBorda.setAltura(21);
        fitaBorda.setEspessura(7);
        return fitaBorda;
    }

    public static DFitaBorda createNonExistingDFitaBorda(Integer nonExistingId) {
        DFitaBorda fitaBorda = new DFitaBorda();
        fitaBorda.setCodigo(nonExistingId);
        fitaBorda.setDescricao("Descrição");
        fitaBorda.setTipoMaterial(DTipoMaterialEnum.FITA_BORDA);
        fitaBorda.setImplantacao(LocalDate.of(3000,1,1));
        fitaBorda.setPorcentagemPerda(12.0);
        fitaBorda.setValor(10.0);
        fitaBorda.setAltura(21);
        fitaBorda.setEspessura(7);
        return fitaBorda;
    }
}
