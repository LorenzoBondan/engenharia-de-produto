package br.com.todeschini.persistence.publico.categoriacomponente;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.CategoriaComponente;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;

@QueryService
public interface CategoriaComponenteQueryRepository extends PagingAndSortingRepository<CategoriaComponente, Integer>, JpaSpecificationExecutor<CategoriaComponente> {

    Collection<CategoriaComponente> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
}
