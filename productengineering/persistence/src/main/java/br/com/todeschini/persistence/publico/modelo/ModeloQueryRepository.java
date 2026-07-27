package br.com.todeschini.persistence.publico.modelo;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Modelo;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface ModeloQueryRepository extends PagingAndSortingRepository<Modelo, Integer>, JpaSpecificationExecutor<Modelo> {

    Collection<Modelo> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
