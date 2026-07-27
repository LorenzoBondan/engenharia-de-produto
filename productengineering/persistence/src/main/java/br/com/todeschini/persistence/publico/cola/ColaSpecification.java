package br.com.todeschini.persistence.publico.cola;

import br.com.todeschini.persistence.entities.publico.Chapa;
import br.com.todeschini.persistence.entities.publico.Cola;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class ColaSpecification extends SearchSpecificationImpl<Cola> {

    public ColaSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
