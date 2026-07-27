package br.com.todeschini.persistence.publico.material;

import br.com.todeschini.persistence.entities.publico.Material;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class MaterialSpecification extends SearchSpecificationImpl<Material> {

    public MaterialSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
