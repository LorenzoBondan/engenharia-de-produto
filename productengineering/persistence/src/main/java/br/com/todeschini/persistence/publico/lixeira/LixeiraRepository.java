package br.com.todeschini.persistence.publico.lixeira;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Lixeira;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.util.Map;

@QueryService
public interface LixeiraRepository extends CrudRepository<Lixeira, Integer>, JpaSpecificationExecutor<Lixeira> {

    Lixeira findByEntidadeid(Map<String, Object> entidadeId);
}
