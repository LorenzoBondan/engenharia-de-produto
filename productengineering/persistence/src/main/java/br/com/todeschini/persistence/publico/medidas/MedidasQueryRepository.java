package br.com.todeschini.persistence.publico.medidas;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Medidas;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface MedidasQueryRepository extends PagingAndSortingRepository<Medidas, Integer>, JpaSpecificationExecutor<Medidas> {

    Collection<Medidas> findByAlturaAndLarguraAndEspessura(Integer altura, Integer largura, Integer espesura); // usado para verificar registro duplicado
}
