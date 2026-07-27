package br.com.todeschini.persistence.publico.grupomaquina;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.GrupoMaquina;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface GrupoMaquinaRepository extends CrudRepository<GrupoMaquina, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_grupo_maquina WHERE cdgrupo_maquina = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
