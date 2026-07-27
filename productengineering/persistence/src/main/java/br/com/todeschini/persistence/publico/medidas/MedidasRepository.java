package br.com.todeschini.persistence.publico.medidas;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Medidas;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MedidasRepository extends CrudRepository<Medidas, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_medidas WHERE cdmedidas = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
