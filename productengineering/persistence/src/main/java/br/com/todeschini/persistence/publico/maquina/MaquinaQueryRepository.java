package br.com.todeschini.persistence.publico.maquina;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Maquina;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface MaquinaQueryRepository extends PagingAndSortingRepository<Maquina, Integer>, JpaSpecificationExecutor<Maquina> {

    Collection<Maquina> findByNomeIgnoreCase(String nome); // usado para verificar registro duplicado
}
