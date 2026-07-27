package br.com.todeschini.persistence.publico.materialusado;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.MaterialUsado;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface MaterialUsadoRepository extends CrudRepository<MaterialUsado, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_material_usado WHERE cdmaterial_usado = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
