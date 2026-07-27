package br.com.todeschini.persistence.publico.cantoneira;

import br.com.todeschini.persistence.entities.publico.Cantoneira;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class CantoneiraSpecification extends SearchSpecificationImpl<Cantoneira> {

    public CantoneiraSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
