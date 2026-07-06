package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;

import java.time.LocalDate;

public class AcessorioFactory {

    public static DAcessorio createDAcessorio() {
        DAcessorio acessorio = new DAcessorio();
        acessorio.setCodigo(1);
        acessorio.setDescricao("Descrição");
        acessorio.setMedidas(new DMedidas(100));
        acessorio.setCor(new DCor(100));
        acessorio.setImplantacao(LocalDate.of(3000,1,1));
        acessorio.setValor(10.0);
        return acessorio;
    }

    public static DAcessorio createDuplicatedDAcessorio(String duplicatedDescription) {
        DAcessorio acessorio = new DAcessorio();
        acessorio.setCodigo(2);
        acessorio.setDescricao(duplicatedDescription);
        acessorio.setMedidas(new DMedidas(100));
        acessorio.setCor(new DCor(100));
        acessorio.setImplantacao(LocalDate.of(3000,1,1));
        acessorio.setValor(10.0);
        return acessorio;
    }

    public static DAcessorio createNonExistingDAcessorio(Integer nonExistingId) {
        DAcessorio acessorio = new DAcessorio();
        acessorio.setCodigo(nonExistingId);
        acessorio.setDescricao("Descrição");
        acessorio.setMedidas(new DMedidas(100));
        acessorio.setCor(new DCor(100));
        acessorio.setImplantacao(LocalDate.of(3000,1,1));
        acessorio.setValor(10.0);
        return acessorio;
    }
}
