package br.com.todeschini.persistence.publico.poliester;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Poliester;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface PoliesterQueryRepository extends PagingAndSortingRepository<Poliester, Integer>, JpaSpecificationExecutor<Poliester> {

    Collection<Poliester> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
