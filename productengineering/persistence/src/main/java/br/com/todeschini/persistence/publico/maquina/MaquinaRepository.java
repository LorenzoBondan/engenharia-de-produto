package br.com.todeschini.persistence.publico.maquina;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Maquina;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MaquinaRepository extends CrudRepository<Maquina, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_maquina WHERE cdmaquina = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
