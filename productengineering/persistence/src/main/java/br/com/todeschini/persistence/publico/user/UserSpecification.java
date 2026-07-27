package br.com.todeschini.persistence.publico.user;

import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.util.SearchCriteria;
import br.com.todeschini.persistence.util.SearchSpecificationImpl;

public class UserSpecification extends SearchSpecificationImpl<User> {

    public UserSpecification(SearchCriteria criteria) {
        super(criteria);
    }
}
