package br.com.todeschini.persistence.publico.grupomaquina;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface GrupoMaquinaQueryRepository extends PagingAndSortingRepository<GrupoMaquina, Integer>, JpaSpecificationExecutor<GrupoMaquina> {

    Collection<GrupoMaquina> findByNomeIgnoreCase(String nome); // usado para verificar registro duplicado
}
