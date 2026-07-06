package br.com.todeschini.domain.business.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DTipoMaterialEnum {

    CHAPA_MDP(1, "Chapa MDP"),
    CHAPA_MDF(2, "Chapa MDF"),
    FITA_BORDA(3, "Fita Borda"),
    COLA(4, "Cola"),
    CANTONEIRA(5, "Cantoneira"),
    TNT(6, "Tnt"),
    POLIETILENO(7, "Polietileno"),
    PLASTICO(8, "Plastico"),
    PINTURA(9, "Pintura"),
    PINTURA_DE_BORDA_DE_FUNDO(10, "Pintura de borda de fundo"),
    POLIESTER(11, "Poliéster"),
    BAGUETE(12, "Baguete");

    private final Integer value;
    private final String label;

    public static DTipoMaterialEnum fromValue(Integer value) {
        for (DTipoMaterialEnum obj : DTipoMaterialEnum.values()) {
            if (obj.value.equals(value)) {
                return obj;
            }
        }
        throw new IllegalArgumentException("Valor desconhecido: " + value);
    }
}
