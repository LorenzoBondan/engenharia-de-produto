package br.com.todeschini.persistence.publico.cantoneira;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Cantoneira;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface CantoneiraQueryRepository extends PagingAndSortingRepository<Cantoneira, Integer>, JpaSpecificationExecutor<Cantoneira> {

    Collection<Cantoneira> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
