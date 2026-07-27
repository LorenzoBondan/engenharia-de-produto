package br.com.todeschini.persistence.publico.lixeira;

import br.com.todeschini.persistence.entities.publico.Lixeira;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class LixeiraSpecification extends SearchSpecificationImpl<Lixeira> {

    public LixeiraSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
