package br.com.todeschini.persistence.publico.modelo;

import br.com.todeschini.persistence.entities.publico.Modelo;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class ModeloSpecification extends SearchSpecificationImpl<Modelo> {

    public ModeloSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
