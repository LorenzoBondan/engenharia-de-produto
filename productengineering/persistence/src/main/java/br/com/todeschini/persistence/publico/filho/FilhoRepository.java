package br.com.todeschini.persistence.publico.filho;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.Filho;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface FilhoRepository extends CrudRepository<Filho, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_filho WHERE cdfilho = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
