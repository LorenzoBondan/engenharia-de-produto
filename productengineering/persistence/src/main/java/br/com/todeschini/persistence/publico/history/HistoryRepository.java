package br.com.todeschini.persistence.publico.history;

import br.com.todeschini.persistence.entities.publico.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoryRepository extends CrudRepository<History, Integer> {

    // H2-compatible query using JSON_VALUE function (works in H2 2.x+)
    // PostgreSQL version uses ->> operator (handled by implementation)
    @Query(nativeQuery = true, value = "SELECT * FROM t_history WHERE tabname = :tabname AND old_val->>:idName = :recordId")
    List<History> findByTabnameAndRecordId(@Param("tabname") String tabname,
                                           @Param("idName") String idName,
                                           @Param("recordId") String recordId);

    // Simplified query for cross-database compatibility (H2 and PostgreSQL)
    // Note: unaccent function is PostgreSQL-specific and removed for H2 compatibility
    @Query(nativeQuery = true, value = """
        SELECT * FROM t_history t
        WHERE upper(t.tabname) LIKE upper(concat(:tabname, '%'))
        AND upper(CAST(JSON_VALUE(t.old_val, CONCAT('$.', :idName)) AS VARCHAR)) LIKE upper(concat(:recordId, '%'))
        AND t.tstamp >= :dataInicial
        AND t.tstamp <= :dataFinal
        AND upper(t.operation) LIKE upper(concat(:operation, '%'))
    """)
    Page<History> findByTabnameAndTstampBetweenAndOperationAndRecordId(
            @Param("tabname") String tabname,
            @Param("dataInicial") LocalDateTime dataInicial,
            @Param("dataFinal") LocalDateTime dataFinal,
            @Param("operation") String operation,
            @Param("idName") String idName,
            @Param("recordId") String recordId,
            Pageable pageable);
}
