package br.com.todeschini.persistence.publico.plastico;

import br.com.todeschini.persistence.entities.publico.Plastico;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class PlasticoSpecification extends SearchSpecificationImpl<Plastico> {

    public PlasticoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
