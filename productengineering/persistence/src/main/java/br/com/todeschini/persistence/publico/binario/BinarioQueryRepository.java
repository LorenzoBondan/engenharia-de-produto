package br.com.todeschini.persistence.publico.binario;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Binario;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.ListPagingAndSortingRepository;

@QueryService
public interface BinarioQueryRepository extends ListPagingAndSortingRepository<Binario, Integer>, JpaSpecificationExecutor<Binario> {
}
