package br.com.todeschini.domain.projections;

import java.time.LocalDateTime;

public interface AuditoriaProjection {
    String criadoPor();
    LocalDateTime criadoEm();
    String situacao();
}
