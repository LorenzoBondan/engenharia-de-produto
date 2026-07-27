package br.com.todeschini.persistence.publico.maquina;

import br.com.todeschini.persistence.entities.publico.Maquina;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class MaquinaSpecification extends SearchSpecificationImpl<Maquina> {

    public MaquinaSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
