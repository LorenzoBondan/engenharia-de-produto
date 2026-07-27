package br.com.todeschini.persistence.util;

import lombok.*;

/**
 * Método buscarTodos
 * Classe que representa os atributos a serem solicitados na requisição
 */

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchCriteria {

    private String key;
    private String operation;
    private Object value;
}
