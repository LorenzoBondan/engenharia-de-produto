package br.com.todeschini.persistence.publico.pai;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Pai;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PaiRepository extends CrudRepository<Pai, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_pai WHERE cdpai = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
