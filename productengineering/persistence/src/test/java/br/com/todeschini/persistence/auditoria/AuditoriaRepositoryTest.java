package br.com.todeschini.persistence.auditoria;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.domain.projections.AuditoriaProjectionImpl;
import br.com.todeschini.persistence.util.AuditoriaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.query.NativeQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AuditoriaRepositoryTest {

    private EntityManager entityManager;
    private NativeQuery nativeQuery;
    private AuditoriaRepository auditoriaRepository;

    @BeforeEach
    void setUp() {
        entityManager = Mockito.mock(EntityManager.class);
        nativeQuery = Mockito.mock(NativeQuery.class);
        auditoriaRepository = new AuditoriaRepository();
        auditoriaRepository.entityManager = entityManager;
    }

    @Test
    void testFindAuditoriaById_Success() {
        // arrange
        AuditoriaProjectionImpl mockProjection = new AuditoriaProjectionImpl(
                "admin",
                LocalDateTime.parse("2025-01-01T10:00:00"),
                "ATIVO"
        );

        when(entityManager.createNativeQuery(anyString())).thenReturn(nativeQuery);
        when(nativeQuery.setParameter("id", 1)).thenReturn(nativeQuery);
        when(nativeQuery.unwrap(NativeQuery.class)).thenReturn(nativeQuery);
        when(nativeQuery.setTupleTransformer(any())).thenAnswer(invocation -> {
            return (NativeQuery<Object>) nativeQuery; // simula o transformador de tuplas retornando o objeto esperado
        });
        when(nativeQuery.getSingleResult()).thenReturn(mockProjection);

        // act
        AuditoriaProjection projection = auditoriaRepository.findAuditoriaById(MockEntity.class, 1);

        // assert
        assertEquals("admin", projection.criadoPor());
        assertEquals(LocalDateTime.parse("2025-01-01T10:00:00"), projection.criadoEm());
        assertEquals("ATIVO", projection.situacao());
    }

    @Test
    void testFindAuditoriaById_NotFound() {
        // arrange
        when(entityManager.createNativeQuery(anyString())).thenReturn(nativeQuery);
        when(nativeQuery.setParameter("id", 99)).thenReturn(nativeQuery);
        when(nativeQuery.unwrap(NativeQuery.class)).thenReturn(nativeQuery);
        when(nativeQuery.setTupleTransformer(any())).thenReturn((NativeQuery<Object>) nativeQuery);
        when(nativeQuery.getSingleResult()).thenThrow(new jakarta.persistence.NoResultException());

        // act e assert
        assertThrows(jakarta.persistence.NoResultException.class,
                () -> auditoriaRepository.findAuditoriaById(MockEntity.class, 99));
    }

    @Test
    void testFindAuditoriaById_NullId() {
        // act e assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> auditoriaRepository.findAuditoriaById(MockEntity.class, null)
        );

        assertEquals("O ID não pode ser nulo.", exception.getMessage());
    }

    // classe mockada para simular a entidade
    @Table(name = "mockentity")
    private static class MockEntity {
        @Id
        private Integer id;
    }
}
