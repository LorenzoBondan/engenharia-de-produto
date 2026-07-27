package br.com.todeschini.persistence.publico.categoriacomponente;

import br.com.todeschini.persistence.entities.publico.CategoriaComponente;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class CategoriaComponenteSpecification extends SearchSpecificationImpl<CategoriaComponente> {

    public CategoriaComponenteSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
