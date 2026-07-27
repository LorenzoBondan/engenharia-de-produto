package br.com.todeschini.persistence.publico.pinturabordafundo;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.PinturaBordaFundo;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface PinturaBordaFundoQueryRepository extends PagingAndSortingRepository<PinturaBordaFundo, Integer>, JpaSpecificationExecutor<PinturaBordaFundo> {

    Collection<PinturaBordaFundo> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
