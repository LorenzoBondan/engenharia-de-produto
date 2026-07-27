package br.com.todeschini.persistence.publico.medidas;

import br.com.todeschini.persistence.entities.publico.Medidas;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class MedidasSpecification extends SearchSpecificationImpl<Medidas> {

    public MedidasSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
