package br.com.todeschini.domain.business.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DSituacaoEnum {
    ATIVO(1, "Ativo"),
    INATIVO(2, "Inativo"),
    LIXEIRA(3, "Lixeira");

    private final Integer value;
    private final String label;
}
