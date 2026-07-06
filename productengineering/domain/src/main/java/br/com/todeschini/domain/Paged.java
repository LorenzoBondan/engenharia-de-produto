package br.com.todeschini.domain;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Paged<T> {

    private int numberOfElements;
    private int page;
    private int totalPages;
    private int size;
    private boolean first;
    private boolean last;
    private String sortedBy;
    private List<T> content = new ArrayList<>();
}
