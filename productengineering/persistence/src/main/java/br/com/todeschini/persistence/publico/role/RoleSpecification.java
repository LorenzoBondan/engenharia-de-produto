package br.com.todeschini.persistence.publico.role;

import br.com.todeschini.persistence.entities.publico.Role;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class RoleSpecification extends SearchSpecificationImpl<Role> {

    public RoleSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
