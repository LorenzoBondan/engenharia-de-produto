package br.com.todeschini.persistence.publico.cola;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Cola;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ColaRepository extends CrudRepository<Cola, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_material WHERE cdmaterial = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
