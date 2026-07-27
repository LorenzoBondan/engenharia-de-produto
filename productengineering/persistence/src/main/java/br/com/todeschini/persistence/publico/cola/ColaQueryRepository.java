package br.com.todeschini.persistence.publico.cola;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Cola;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface ColaQueryRepository extends PagingAndSortingRepository<Cola, Integer>, JpaSpecificationExecutor<Cola> {

    Collection<Cola> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
