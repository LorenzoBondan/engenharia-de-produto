package br.com.todeschini.persistence.publico.roteiro;

import br.com.todeschini.persistence.entities.publico.Roteiro;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class RoteiroSpecification extends SearchSpecificationImpl<Roteiro> {

    public RoteiroSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
