package br.com.todeschini.persistence.publico.materialusado;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface MaterialUsadoQueryRepository extends PagingAndSortingRepository<MaterialUsado, Integer>, JpaSpecificationExecutor<MaterialUsado> {

    Collection<MaterialUsado> findByFilho_CdfilhoAndMaterial_Cdmaterial(Integer cdfilho, Integer cdmaterial); // usado para verificar registro duplicado
}
