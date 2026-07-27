package br.com.todeschini.persistence.publico.baguete;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Baguete;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface BagueteQueryRepository extends PagingAndSortingRepository<Baguete, Integer>, JpaSpecificationExecutor<Baguete> {

    Collection<Baguete> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
