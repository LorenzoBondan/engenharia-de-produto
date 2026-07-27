package br.com.todeschini.persistence.publico.acessoriousado;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.AcessorioUsado;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface AcessorioUsadoQueryRepository extends PagingAndSortingRepository<AcessorioUsado, Integer>, JpaSpecificationExecutor<AcessorioUsado> {

    Collection<AcessorioUsado> findByAcessorio_CdacessorioAndFilho_Cdfilho(Integer cdacessorio, Integer cdfilho); // usado para verificar registro duplicado
}
