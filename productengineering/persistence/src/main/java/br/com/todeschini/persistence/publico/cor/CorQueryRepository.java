package br.com.todeschini.persistence.publico.cor;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Cor;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface CorQueryRepository extends PagingAndSortingRepository<Cor, Integer>, JpaSpecificationExecutor<Cor> {

    Collection<Cor> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
