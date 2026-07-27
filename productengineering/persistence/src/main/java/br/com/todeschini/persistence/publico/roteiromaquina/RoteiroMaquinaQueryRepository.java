package br.com.todeschini.persistence.publico.roteiromaquina;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.RoteiroMaquina;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface RoteiroMaquinaQueryRepository extends PagingAndSortingRepository<RoteiroMaquina, Integer>, JpaSpecificationExecutor<RoteiroMaquina> {

    Collection<RoteiroMaquina> findByRoteiro_CdroteiroAndMaquina_Cdmaquina(Integer cdroteiro, Integer cdmaquina); // usado para verificar registro duplicado
}
