package br.com.todeschini.persistence.publico.polietileno;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Polietileno;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface PolietilenoQueryRepository extends PagingAndSortingRepository<Polietileno, Integer>, JpaSpecificationExecutor<Polietileno> {

    Collection<Polietileno> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
