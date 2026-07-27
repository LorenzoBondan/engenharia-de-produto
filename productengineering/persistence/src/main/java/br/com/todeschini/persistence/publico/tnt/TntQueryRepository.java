package br.com.todeschini.persistence.publico.tnt;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Tnt;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface TntQueryRepository extends PagingAndSortingRepository<Tnt, Integer>, JpaSpecificationExecutor<Tnt> {

    Collection<Tnt> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
