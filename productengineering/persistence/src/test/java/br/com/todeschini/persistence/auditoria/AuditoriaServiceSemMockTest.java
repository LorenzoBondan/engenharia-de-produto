package br.com.todeschini.persistence.auditoria;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.AuditoriaInfo;
import br.com.todeschini.persistence.util.AuditoriaRepository;
import br.com.todeschini.persistence.util.AuditoriaService;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuditoriaServiceSemMockTest {

    private InMemoryAuditoriaRepository auditoriaRepository;
    private AuditoriaService auditoriaService;

    @BeforeEach
    void setUp() {
        auditoriaRepository = new InMemoryAuditoriaRepository();
        auditoriaService = new AuditoriaService(auditoriaRepository);
    }

    @Test
    void testSetCreationProperties_Success() {
        // arrange
        MockEntity mockEntity = new MockEntity();
        mockEntity.setId(1);

        InMemoryAuditoriaProjection projection = new InMemoryAuditoriaProjection(
                LocalDateTime.parse("2025-01-01T10:00:00"), "admin", "ATIVO"
        );
        auditoriaRepository.save(MockEntity.class, 1, projection);

        // act
        auditoriaService.setCreationProperties(mockEntity);

        // assert
        assertEquals(LocalDateTime.parse("2025-01-01T10:00:00"), mockEntity.getCriadoem());
        assertEquals("admin", mockEntity.getCriadopor());
        assertEquals(SituacaoEnum.ATIVO, mockEntity.getSituacao());
    }

    @Test
    void testSetCreationProperties_NullId() {
        // arrange
        MockEntity mockEntity = new MockEntity();

        // act e assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> auditoriaService.setCreationProperties(mockEntity)
        );

        assertEquals("O campo ID não pode ser nulo.", exception.getMessage());
    }

    @Test
    void testSetCreationProperties_AuditoriaNotFound() {
        // arrange
        MockEntity mockEntity = new MockEntity();
        mockEntity.setId(1);

        // act e assert
        NullPointerException exception = assertThrows(
                NullPointerException.class,
                () -> auditoriaService.setCreationProperties(mockEntity)
        );

        assertEquals("Cannot invoke \"br.com.todeschini.domain.projections.AuditoriaProjection.criadoEm()\" because \"auditoria\" is null", exception.getMessage());
    }

    // implementação de repositório em memória
    private static class InMemoryAuditoriaRepository extends AuditoriaRepository {
        private final Map<Class<?>, Map<Integer, AuditoriaProjection>> database = new HashMap<>();

        public void save(Class<?> entityClass, Integer id, AuditoriaProjection projection) {
            database.computeIfAbsent(entityClass, k -> new HashMap<>()).put(id, projection);
        }

        @Override
        public AuditoriaProjection findAuditoriaById(Class<?> entityClass, Integer id) {
            return database.getOrDefault(entityClass, new HashMap<>()).get(id);
        }
    }

    // projeção simples para teste
    private static class InMemoryAuditoriaProjection implements AuditoriaProjection {
        private final LocalDateTime criadoEm;
        private final String criadoPor;
        private final String situacao;

        public InMemoryAuditoriaProjection(LocalDateTime criadoEm, String criadoPor, String situacao) {
            this.criadoEm = criadoEm;
            this.criadoPor = criadoPor;
            this.situacao = situacao;
        }

        @Override
        public LocalDateTime criadoEm() {
            return criadoEm;
        }

        @Override
        public String criadoPor() {
            return criadoPor;
        }

        @Override
        public String situacao() {
            return situacao;
        }
    }

    // classe de exemplo para simular a entidade
    @Setter
    @Getter
    private static class MockEntity extends AuditoriaInfo {
        @Id
        private Integer id;
    }
}

