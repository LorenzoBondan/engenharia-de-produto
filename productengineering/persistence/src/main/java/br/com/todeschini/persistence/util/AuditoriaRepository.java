package br.com.todeschini.persistence.util;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.domain.projections.AuditoriaProjectionImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.query.NativeQuery;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

/**
 * Repositório genérico para consultar dados de Auditoria: criadopor, criadoem e situacao de uma classe genérica
 */
@Repository
public class AuditoriaRepository {

    @PersistenceContext
    public EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public AuditoriaProjection findAuditoriaById(Class<?> entityClass, Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("O ID não pode ser nulo.");
        }

        String tableName = JpaMetadataUtils.getTableName(entityClass);
        String idColumn = JpaMetadataUtils.getIdColumnName(entityClass);

        String query = """
            SELECT criadopor, criadoem, situacao
            FROM %s
            WHERE %s = :id
        """.formatted(tableName, idColumn);

        return (AuditoriaProjection) entityManager.createNativeQuery(query)
                .setParameter("id", id)
                .unwrap(NativeQuery.class)
                .setTupleTransformer((tuple, aliases) -> new AuditoriaProjectionImpl(
                        (String) tuple[0],
                        tuple[1] != null ? ((Timestamp) tuple[1]).toLocalDateTime() : null,
                        (String) tuple[2]
                ))
                .getSingleResult();
    }
}


