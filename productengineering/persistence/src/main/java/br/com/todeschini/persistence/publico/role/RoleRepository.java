package br.com.todeschini.persistence.publico.role;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Role;
import org.springframework.data.jpa.repository.JpaRepository;

@QueryService
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
