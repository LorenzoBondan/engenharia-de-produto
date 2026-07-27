package br.com.todeschini.persistence.publico.history;

import br.com.todeschini.persistence.entities.publico.History;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class HistorySpecification extends SearchSpecificationImpl<History> {

    public HistorySpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
