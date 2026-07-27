package br.com.todeschini.persistence.entities.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SituacaoEnum implements MappableStringEnum {

    ATIVO(1, "Ativo"),
    INATIVO(2, "Inativo"),
    LIXEIRA(3, "Lixeira");

    private final Integer value;
    private final String label;

    public static SituacaoEnum fromValue(Integer value) {
        for (SituacaoEnum obj : SituacaoEnum.values()) {
            if (obj.value.equals(value)) {
                return obj;
            }
        }
        throw new IllegalArgumentException("Valor desconhecido: " + value);
    }

    @Override
    public String getLabel() {
        return label;
    }
}