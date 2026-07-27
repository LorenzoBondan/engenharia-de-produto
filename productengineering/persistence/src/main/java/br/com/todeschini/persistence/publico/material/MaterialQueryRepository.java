package br.com.todeschini.persistence.publico.material;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Material;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface MaterialQueryRepository extends PagingAndSortingRepository<Material, Integer>, JpaSpecificationExecutor<Material> {

    Collection<Material> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
