package br.com.todeschini.persistence.publico.anexo;

import br.com.todeschini.persistence.entities.publico.Anexo;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class AnexoSpecification extends SearchSpecificationImpl<Anexo> {

    public AnexoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
