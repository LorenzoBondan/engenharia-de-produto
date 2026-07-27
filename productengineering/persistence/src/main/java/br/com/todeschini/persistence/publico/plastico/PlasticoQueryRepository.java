package br.com.todeschini.persistence.publico.plastico;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Plastico;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface PlasticoQueryRepository extends PagingAndSortingRepository<Plastico, Integer>, JpaSpecificationExecutor<Plastico> {

    Collection<Plastico> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
