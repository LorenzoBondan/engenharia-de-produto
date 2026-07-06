package br.com.todeschini.domain.business.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DTipoFilhoEnum {

    MDP(1, "MDP"),
    MDF(2, "MDF"),
    ALUMINIO(3, "Alumínio"),
    FUNDO(4, "Fundo");

    private final Integer value;
    private final String label;

    public static DTipoFilhoEnum fromValue(Integer value) {
        for (DTipoFilhoEnum obj : DTipoFilhoEnum.values()) {
            if (obj.value.equals(value)) {
                return obj;
            }
        }
        throw new IllegalArgumentException("Valor desconhecido: " + value);
    }
}
