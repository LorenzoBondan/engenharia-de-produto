package br.com.todeschini.domain.util.tests;

import br.com.todeschini.domain.business.enums.DTipoMaterialEnum;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

import java.time.LocalDate;

public class PinturaBordaFundoFactory {

    public static DPinturaBordaFundo createDPinturaBordaFundo() {
        DPinturaBordaFundo PinturaBordaFundo = new DPinturaBordaFundo();
        PinturaBordaFundo.setCodigo(1);
        PinturaBordaFundo.setDescricao("Descrição");
        PinturaBordaFundo.setTipoMaterial(DTipoMaterialEnum.PINTURA_DE_BORDA_DE_FUNDO);
        PinturaBordaFundo.setImplantacao(LocalDate.of(3000,1,1));
        PinturaBordaFundo.setPorcentagemPerda(12.0);
        PinturaBordaFundo.setValor(10.0);
        PinturaBordaFundo.setCor(new DCor(100));
        return PinturaBordaFundo;
    }

    public static DPinturaBordaFundo createDuplicatedDPinturaBordaFundo(String duplicatedDescription) {
        DPinturaBordaFundo PinturaBordaFundo = new DPinturaBordaFundo();
        PinturaBordaFundo.setCodigo(2);
        PinturaBordaFundo.setDescricao(duplicatedDescription);
        PinturaBordaFundo.setTipoMaterial(DTipoMaterialEnum.PINTURA_DE_BORDA_DE_FUNDO);
        PinturaBordaFundo.setImplantacao(LocalDate.of(3000,1,1));
        PinturaBordaFundo.setPorcentagemPerda(12.0);
        PinturaBordaFundo.setValor(10.0);
        PinturaBordaFundo.setCor(new DCor(100));
        return PinturaBordaFundo;
    }

    public static DPinturaBordaFundo createNonExistingDPinturaBordaFundo(Integer nonExistingId) {
        DPinturaBordaFundo PinturaBordaFundo = new DPinturaBordaFundo();
        PinturaBordaFundo.setCodigo(nonExistingId);
        PinturaBordaFundo.setDescricao("Descrição");
        PinturaBordaFundo.setTipoMaterial(DTipoMaterialEnum.PINTURA_DE_BORDA_DE_FUNDO);
        PinturaBordaFundo.setImplantacao(LocalDate.of(3000,1,1));
        PinturaBordaFundo.setPorcentagemPerda(12.0);
        PinturaBordaFundo.setValor(10.0);
        PinturaBordaFundo.setCor(new DCor(100));
        return PinturaBordaFundo;
    }
}
