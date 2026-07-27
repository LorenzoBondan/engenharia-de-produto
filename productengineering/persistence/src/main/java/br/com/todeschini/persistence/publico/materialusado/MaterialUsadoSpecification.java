package br.com.todeschini.persistence.publico.materialusado;

import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class MaterialUsadoSpecification extends SearchSpecificationImpl<MaterialUsado> {

    public MaterialUsadoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
