package br.com.todeschini.persistence.publico.binario;

import br.com.todeschini.persistence.entities.publico.Binario;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class BinarioSpecification extends SearchSpecificationImpl<Binario> {

    public BinarioSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
