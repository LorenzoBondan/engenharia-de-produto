package br.com.todeschini.persistence.publico.useranexo;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.UserAnexo;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface UserAnexoQueryRepository extends PagingAndSortingRepository<UserAnexo, Integer>, JpaSpecificationExecutor<UserAnexo> {

    Collection<UserAnexo> findByUser_IdAndAnexo_Cdanexo(Integer cduser, Integer cdanexo); // usado para verificar registro duplicado
}
