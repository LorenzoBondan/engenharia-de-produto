package br.com.todeschini.persistence.publico.cor;

import br.com.todeschini.persistence.entities.publico.Cor;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class CorSpecification extends SearchSpecificationImpl<Cor> {

    public CorSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
