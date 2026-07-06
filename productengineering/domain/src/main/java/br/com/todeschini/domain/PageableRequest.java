package br.com.todeschini.domain;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PageableRequest {
    private Integer page;
    private Integer pageSize;
    private String[] sort;

    private List<String> colunas;
    private List<String> operacoes;
    private List<String> valores;

    private Map<String, String> columnMap;
}
