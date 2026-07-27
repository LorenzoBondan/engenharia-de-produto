package br.com.todeschini.persistence.publico.acessoriousado;

import br.com.todeschini.persistence.entities.publico.AcessorioUsado;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class AcessorioUsadoSpecification extends SearchSpecificationImpl<AcessorioUsado> {

    public AcessorioUsadoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
