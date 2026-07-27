package br.com.todeschini.persistence.publico.acessorio;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Acessorio;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface AcessorioQueryRepository extends PagingAndSortingRepository<Acessorio, Integer>, JpaSpecificationExecutor<Acessorio> {

    Collection<Acessorio> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
