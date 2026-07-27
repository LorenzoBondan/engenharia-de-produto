package br.com.todeschini.persistence.publico.lixeira;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

@QueryService
public interface LixeiraQueryRepository extends PagingAndSortingRepository<Lixeira, Integer>, JpaSpecificationExecutor<Lixeira> {
}
