package br.com.todeschini.persistence.publico.grupomaquina;

import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class GrupoMaquinaSpecification extends SearchSpecificationImpl<GrupoMaquina> {

    public GrupoMaquinaSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
