package br.com.todeschini.persistence.publico.fitaborda;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.FitaBorda;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface FitaBordaQueryRepository extends PagingAndSortingRepository<FitaBorda, Integer>, JpaSpecificationExecutor<FitaBorda> {

    Collection<FitaBorda> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado

    FitaBorda findByAlturaAndCor_Cdcor(Integer altura, Integer cdcor);
}
