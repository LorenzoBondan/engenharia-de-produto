package br.com.todeschini.persistence.publico.baguete;

import br.com.todeschini.persistence.entities.publico.Baguete;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class BagueteSpecification extends SearchSpecificationImpl<Baguete> {

    public BagueteSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
