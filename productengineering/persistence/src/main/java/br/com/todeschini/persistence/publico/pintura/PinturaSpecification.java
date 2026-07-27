package br.com.todeschini.persistence.publico.pintura;

import br.com.todeschini.persistence.entities.publico.Pintura;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class PinturaSpecification extends SearchSpecificationImpl<Pintura> {

    public PinturaSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
