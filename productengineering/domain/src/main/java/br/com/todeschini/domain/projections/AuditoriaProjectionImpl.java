package br.com.todeschini.domain.projections;

import java.time.LocalDateTime;

/**
 * Implementação da AuditoriaProjection
 * Utilizada no AuditoriaRepository
 */
public record AuditoriaProjectionImpl(String criadoPor, LocalDateTime criadoEm, String situacao) implements AuditoriaProjection {
}

