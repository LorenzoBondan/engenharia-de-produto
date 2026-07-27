package br.com.todeschini.persistence.publico.roteiromaquina;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.RoteiroMaquina;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface RoteiroMaquinaRepository extends CrudRepository<RoteiroMaquina, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_roteiro_maquina WHERE cdroteiro_maquina = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
