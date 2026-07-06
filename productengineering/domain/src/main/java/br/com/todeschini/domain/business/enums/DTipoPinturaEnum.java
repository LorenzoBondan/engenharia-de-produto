package br.com.todeschini.domain.business.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DTipoPinturaEnum {

    ACETINADA(1, "Acetinada"),
    ALTO_BRILHO(2, "Alto brilho"),
    ACETINADA_VIDRO(3, "Acetinada vidro");

    private final Integer value;
    private final String label;

    public static DTipoPinturaEnum fromValue(Integer value) {
        for (DTipoPinturaEnum obj : DTipoPinturaEnum.values()) {
            if (obj.value.equals(value)) {
                return obj;
            }
        }
        throw new IllegalArgumentException("Valor desconhecido: " + value);
    }
}
