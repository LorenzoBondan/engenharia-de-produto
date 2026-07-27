package br.com.todeschini.persistence.publico.roteiro;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Roteiro;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface RoteiroRepository extends CrudRepository<Roteiro, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_roteiro WHERE cdroteiro = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
