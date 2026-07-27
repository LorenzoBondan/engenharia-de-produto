package br.com.todeschini.persistence.publico.anexo;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Anexo;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.ListPagingAndSortingRepository;

@QueryService
public interface AnexoQueryRepository extends ListPagingAndSortingRepository<Anexo, Integer>, JpaSpecificationExecutor<Anexo> {
}
