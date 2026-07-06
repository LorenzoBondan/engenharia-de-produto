package br.com.todeschini.domain.business.publico.assistant;

import lombok.*;

/**
 * DTO para resposta do assistente IA.
 *
 * Contém a resposta gerada pelo LLM e o ID da conversa
 * para permitir continuidade no histórico.
 *
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponseDTO {

    /**
     * Resposta gerada pelo assistente.
     */
    private String reply;

    /**
     * ID da conversa à qual esta mensagem pertence.
     */
    private Integer conversationId;
}
