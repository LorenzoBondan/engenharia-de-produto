package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.enums.DTipoPinturaEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.pintura.DPintura;

import java.time.LocalDate;

public class PinturaFactory {

    public static DPintura createDPintura() {
        DPintura Pintura = new DPintura();
        Pintura.setCodigo(1);
        Pintura.setDescricao("Descrição");
        Pintura.setTipoMaterial(DTipoMaterialEnum.PINTURA);
        Pintura.setImplantacao(LocalDate.of(3000,1,1));
        Pintura.setPorcentagemPerda(12.0);
        Pintura.setValor(10.0);
        Pintura.setCor(new DCor(100));
        Pintura.setTipoPintura(DTipoPinturaEnum.ACETINADA_VIDRO);
        return Pintura;
    }

    public static DPintura createDuplicatedDPintura(String duplicatedDescription) {
        DPintura Pintura = new DPintura();
        Pintura.setCodigo(2);
        Pintura.setDescricao(duplicatedDescription);
        Pintura.setTipoMaterial(DTipoMaterialEnum.PINTURA);
        Pintura.setImplantacao(LocalDate.of(3000,1,1));
        Pintura.setPorcentagemPerda(12.0);
        Pintura.setValor(10.0);
        Pintura.setCor(new DCor(100));
        Pintura.setTipoPintura(DTipoPinturaEnum.ACETINADA);
        return Pintura;
    }

    public static DPintura createNonExistingDPintura(Integer nonExistingId) {
        DPintura Pintura = new DPintura();
        Pintura.setCodigo(nonExistingId);
        Pintura.setDescricao("Descrição");
        Pintura.setTipoMaterial(DTipoMaterialEnum.PINTURA);
        Pintura.setImplantacao(LocalDate.of(3000,1,1));
        Pintura.setPorcentagemPerda(12.0);
        Pintura.setValor(10.0);
        Pintura.setCor(new DCor(100));
        Pintura.setTipoPintura(DTipoPinturaEnum.ACETINADA);
        return Pintura;
    }
}
