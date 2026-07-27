package br.com.todeschini.persistence.auditoria;

import br.com.todeschini.domain.projections.AuditoriaProjection;
import br.com.todeschini.persistence.entities.enums.SituacaoEnum;
import br.com.todeschini.persistence.entities.publico.AuditoriaInfo;
import br.com.todeschini.persistence.util.AuditoriaRepository;
import br.com.todeschini.persistence.util.AuditoriaService;
import br.com.todeschini.persistence.util.JpaMetadataUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AuditoriaServiceTest {

    private AuditoriaRepository auditoriaRepository;
    private AuditoriaService auditoriaService;

    @BeforeEach
    void setUp() {
        auditoriaRepository = Mockito.mock(AuditoriaRepository.class);
        auditoriaService = new AuditoriaService(auditoriaRepository);
    }

    @Test
    void testSetCreationProperties_Success() {
        // arrange
        MockEntity mockEntity = spy(new MockEntity());

        AuditoriaProjection mockProjection = mock(AuditoriaProjection.class);
        when(mockProjection.criadoEm()).thenReturn(LocalDateTime.parse("2025-01-01T10:00:00"));
        when(mockProjection.criadoPor()).thenReturn("admin");
        when(mockProjection.situacao()).thenReturn("ATIVO");

        try (var mockedStatic = mockStatic(JpaMetadataUtils.class)) {
            mockedStatic.when(() -> JpaMetadataUtils.extractId(mockEntity)).thenReturn(1);

            when(auditoriaRepository.findAuditoriaById(MockEntity.class, 1))
                    .thenReturn(mockProjection);

            // act
            auditoriaService.setCreationProperties(mockEntity);

            // assert
            assertEquals(LocalDateTime.parse("2025-01-01T10:00:00"), mockEntity.getCriadoem());
            assertEquals("admin", mockEntity.getCriadopor());
            assertEquals(SituacaoEnum.ATIVO, mockEntity.getSituacao());
        }
    }

    @Test
    void testSetCreationProperties_NullId() {
        // arrange
        MockEntity mockEntity = spy(new MockEntity());

        try (var mockedStatic = mockStatic(JpaMetadataUtils.class)) {
            mockedStatic.when(() -> JpaMetadataUtils.extractId(mockEntity)).thenReturn(null);

            // act e assert
            IllegalArgumentException exception = assertThrows(
                    IllegalArgumentException.class,
                    () -> auditoriaService.setCreationProperties(mockEntity)
            );

            assertEquals("O ID da entidade MockEntity não pode ser nulo.", exception.getMessage());
        }
    }

    @Test
    void testSetCreationProperties_AuditoriaNotFound() {
        // arrange
        MockEntity mockEntity = spy(new MockEntity());

        try (var mockedStatic = mockStatic(JpaMetadataUtils.class)) {
            mockedStatic.when(() -> JpaMetadataUtils.extractId(mockEntity)).thenReturn(1);

            when(auditoriaRepository.findAuditoriaById(MockEntity.class, 1)).thenReturn(null);

            // act & assert
            NullPointerException exception = assertThrows(
                    NullPointerException.class,
                    () -> auditoriaService.setCreationProperties(mockEntity)
            );

            assertEquals("Cannot invoke \"br.com.todeschini.domain.projections.AuditoriaProjection.criadoEm()\" because \"auditoria\" is null", exception.getMessage());
        }
    }

    // classe de exemplo para simular a entidade
    private static class MockEntity extends AuditoriaInfo {
    }
}
