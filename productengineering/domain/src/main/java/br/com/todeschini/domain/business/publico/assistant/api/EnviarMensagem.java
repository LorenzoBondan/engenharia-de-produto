package br.com.todeschini.domain.business.publico.assistant.api;

import br.com.todeschini.domain.business.publico.assistant.ChatResponseDTO;
import br.com.todeschini.domain.exceptions.OllamaOfflineException;
import br.com.todeschini.domain.exceptions.OllamaTimeoutException;

/**
 * Interface para envio de mensagens ao assistente IA.
 *
 * Define o contrato principal para processar mensagens do usuário,
 * gerando respostas context-aware usando LLM local.
 *
 */
public interface EnviarMensagem {

    /**
     * Processa uma mensagem do usuário e retorna resposta do assistente.
     *
     * Precondições:
     * - username deve corresponder a um usuário válido no sistema
     * - message não pode ser nulo ou vazio
     * - message deve ter no máximo 2000 caracteres
     *
     * Postcondições:
     * - Mensagem do usuário persistida no banco (role='user')
     * - Resposta do assistente persistida no banco (role='assistant')
     * - Conversa criada ou atualizada com novo timestamp
     * - ChatResponseDTO retornado com reply e conversationId
     *
     * @param username email/username do usuário autenticado
     * @param message mensagem enviada pelo usuário
     * @param pageContext pathname da página atual (ex: "/sheets", "/fathers")
     * @return resposta do assistente com ID da conversa
     * @throws OllamaOfflineException se Ollama estiver indisponível
     * @throws OllamaTimeoutException se requisição exceder timeout
     * @throws IllegalArgumentException se parâmetros forem inválidos
     */
    ChatResponseDTO execute(String username, String message, String pageContext);
}
