package br.com.todeschini.persistence.publico.user;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

@QueryService
public interface UserQueryRepository extends PagingAndSortingRepository<User, Integer>, JpaSpecificationExecutor<User> {
}
