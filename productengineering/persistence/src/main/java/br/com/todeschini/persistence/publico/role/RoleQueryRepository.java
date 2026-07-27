package br.com.todeschini.persistence.publico.role;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Role;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

@QueryService
public interface RoleQueryRepository extends PagingAndSortingRepository<Role, Integer>, JpaSpecificationExecutor<Role> {
}