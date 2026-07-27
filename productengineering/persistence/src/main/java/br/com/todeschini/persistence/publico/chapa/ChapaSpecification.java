package br.com.todeschini.persistence.publico.chapa;

import br.com.todeschini.persistence.entities.publico.Chapa;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class ChapaSpecification extends SearchSpecificationImpl<Chapa> {

    public ChapaSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
