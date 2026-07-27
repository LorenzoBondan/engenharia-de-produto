package br.com.todeschini.persistence.entities.publico.assistant;

import br.com.todeschini.domain.metadata.Entidade;
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
@Table(name = "tb_message")
@Entidade
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    /**
     * Role da mensagem: 'user' ou 'assistant'.
     */
    @Column(length = 20, nullable = false)
    private String role;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "contexto_pagina", length = 200)
    private String contextoPagina;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    /**
     * Configura timestamp automaticamente antes de persistir.
     */
    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
    }

    /**
     * Verifica se a mensagem é do usuário.
     *
     * @return true se role == 'user'
     */
    public boolean isUser() {
        return "user".equals(role);
    }

    /**
     * Verifica se a mensagem é do assistente.
     *
     * @return true se role == 'assistant'
     */
    public boolean isAssistant() {
        return "assistant".equals(role);
    }
}
