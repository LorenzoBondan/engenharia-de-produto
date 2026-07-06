package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.time.LocalDate;

public class FilhoFactory {

    public static DFilho createDFilho() {
        DFilho filho = new DFilho();
        filho.setCodigo(1);
        filho.setDescricao("Descrição");
        filho.setPai(new DPai(100));
        filho.setCor(new DCor(100));
        filho.setMedidas(new DMedidas(100));
        filho.setRoteiro(new DRoteiro(100));
        filho.setImplantacao(LocalDate.of(3000,1,1));
        filho.setUnidadeMedida("UN");
        filho.setValor(50.0);
        filho.setTipo(DTipoFilhoEnum.MDP);
        return filho;
    }

    public static DFilho createDuplicatedDFilho(String duplicatedDescription, Integer duplicatedId) {
        DFilho filho = new DFilho();
        filho.setCodigo(2);
        filho.setDescricao(duplicatedDescription);
        filho.setPai(new DPai(100));
        filho.setCor(new DCor(duplicatedId));
        filho.setMedidas(new DMedidas(duplicatedId));
        filho.setRoteiro(new DRoteiro(100));
        filho.setImplantacao(LocalDate.of(3000,1,1));
        filho.setUnidadeMedida("UN");
        filho.setValor(50.0);
        filho.setTipo(DTipoFilhoEnum.MDP);
        return filho;
    }

    public static DFilho createNonExistingDFilho(Integer nonExistingId) {
        DFilho filho = new DFilho();
        filho.setCodigo(nonExistingId);
        filho.setDescricao("Descrição");
        filho.setPai(new DPai(100));
        filho.setCor(new DCor(100));
        filho.setMedidas(new DMedidas(100));
        filho.setRoteiro(new DRoteiro(100));
        filho.setImplantacao(LocalDate.of(3000,1,1));
        filho.setUnidadeMedida("UN");
        filho.setValor(50.0);
        filho.setTipo(DTipoFilhoEnum.MDP);
        return filho;
    }
}
