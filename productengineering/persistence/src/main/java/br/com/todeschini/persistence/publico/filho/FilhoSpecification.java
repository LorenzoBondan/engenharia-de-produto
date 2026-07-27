package br.com.todeschini.persistence.publico.filho;

import br.com.todeschini.persistence.entities.publico.Filho;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class FilhoSpecification extends SearchSpecificationImpl<Filho> {

    public FilhoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
