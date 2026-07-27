package br.com.todeschini.persistence.publico.acessorio;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Acessorio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface AcessorioRepository extends CrudRepository<Acessorio, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_acessorio WHERE cdacessorio = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
