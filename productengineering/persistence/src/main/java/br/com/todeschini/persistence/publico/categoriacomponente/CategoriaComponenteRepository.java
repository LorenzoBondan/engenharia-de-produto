package br.com.todeschini.persistence.publico.categoriacomponente;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.publico.CategoriaComponente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface CategoriaComponenteRepository extends CrudRepository<CategoriaComponente, Integer> {

    @Query(nativeQuery = true, value = """
        SELECT criadopor, criadoem, situacao FROM tb_categoria_componente WHERE cdcategoria_componente = :id
    """)
    AuditoriaProjection findAuditoriaById(@Param("id") Integer id);
}
