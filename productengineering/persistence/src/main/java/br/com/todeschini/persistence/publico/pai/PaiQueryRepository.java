package br.com.todeschini.persistence.publico.pai;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.Pai;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Collection;
import java.util.List;

@QueryService
public interface PaiQueryRepository extends PagingAndSortingRepository<Pai, Integer>, JpaSpecificationExecutor<Pai> {

    Collection<Pai> findByDescricaoIgnoreCase(String descricao); // usado para verificar registro duplicado
    List<Pai> findByModelo_Cdmodelo(Integer cdmodelo);
    List<Pai> findByCategoriaComponente_CdcategoriaComponente(Integer cdcategoriaComponente);
}
