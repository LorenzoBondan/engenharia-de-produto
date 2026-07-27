package br.com.todeschini.persistence.publico.useranexo;

import br.com.todeschini.persistence.entities.publico.UserAnexo;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class UserAnexoSpecification extends SearchSpecificationImpl<UserAnexo> {

    public UserAnexoSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
