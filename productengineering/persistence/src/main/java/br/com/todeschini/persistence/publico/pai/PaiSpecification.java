package br.com.todeschini.persistence.publico.pai;

import br.com.todeschini.persistence.entities.publico.Pai;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class PaiSpecification extends SearchSpecificationImpl<Pai> {

    public PaiSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
