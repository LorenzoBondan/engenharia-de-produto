package br.com.todeschini.persistence.entities.publico.assistant;

import br.com.todeschini.domain.metadata.Entidade;
import br.com.todeschini.persistence.entities.publico.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_assistant_config")
@Entidade
public class AssistantConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private User usuario;

    @Column(nullable = false)
    @Builder.Default
    private Boolean habilitado = true;

    /**
     * Tema do widget: 'light' ou 'dark'.
     * Constraint CHECK no banco garante valores válidos.
     */
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String tema = "light";

    @Column(nullable = false)
    @Builder.Default
    private Boolean notificacoes = true;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    /**
     * Configura timestamps automaticamente antes de persistir.
     */
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.criadoEm = now;
        this.atualizadoEm = now;
    }

    /**
     * Atualiza timestamp de atualização antes de update.
     */
    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    /**
     * Verifica se o tema é escuro.
     *
     * @return true se tema == 'dark'
     */
    public boolean isDarkTheme() {
        return "dark".equals(tema);
    }
}
