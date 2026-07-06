package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.time.LocalDate;

public class RoteiroFactory {

    public static DRoteiro createDRoteiro() {
        DRoteiro roteiro = new DRoteiro();
        roteiro.setCodigo(1);
        roteiro.setDescricao("Descrição");
        roteiro.setImplantacao(LocalDate.of(3000,1,1));
        roteiro.setDataFinal(LocalDate.of(4000,1,1));
        roteiro.setValor(50.0);
        return roteiro;
    }

    public static DRoteiro createDuplicatedDRoteiro(String duplicatedDescription) {
        DRoteiro roteiro = new DRoteiro();
        roteiro.setCodigo(2);
        roteiro.setDescricao(duplicatedDescription);
        roteiro.setImplantacao(LocalDate.of(3000,1,1));
        roteiro.setDataFinal(LocalDate.of(4000,1,1));
        roteiro.setValor(50.0);
        return roteiro;
    }

    public static DRoteiro createNonExistingDRoteiro(Integer nonExistingId) {
        DRoteiro roteiro = new DRoteiro();
        roteiro.setCodigo(nonExistingId);
        roteiro.setDescricao("Descrição");
        roteiro.setImplantacao(LocalDate.of(3000,1,1));
        roteiro.setDataFinal(LocalDate.of(4000,1,1));
        roteiro.setValor(50.0);
        return roteiro;
    }
}
