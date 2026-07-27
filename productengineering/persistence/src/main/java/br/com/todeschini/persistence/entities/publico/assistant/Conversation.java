package br.com.todeschini.persistence.entities.publico.assistant;

import br.com.todeschini.domain.metadata.Entidade;
import br.com.todeschini.persistence.entities.publico.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "tb_conversation")
@Entidade
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(length = 200)
    private String titulo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("criadoEm ASC")
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

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
     * Método auxiliar para adicionar mensagem à conversa.
     *
     * @param message mensagem a ser adicionada
     */
    public void addMessage(Message message) {
        messages.add(message);
        message.setConversation(this);
    }
}
