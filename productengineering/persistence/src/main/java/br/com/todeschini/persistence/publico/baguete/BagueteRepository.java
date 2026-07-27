package br.com.todeschini.persistence.publico.baguete;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Baguete;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface BagueteRepository extends CrudRepository<Baguete, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_material WHERE cdmaterial = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
