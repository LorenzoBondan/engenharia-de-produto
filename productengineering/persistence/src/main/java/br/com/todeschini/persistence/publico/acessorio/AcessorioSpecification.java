package br.com.todeschini.persistence.publico.acessorio;

import br.com.todeschini.persistence.entities.publico.Acessorio;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class AcessorioSpecification extends SearchSpecificationImpl<Acessorio> {

    public AcessorioSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
