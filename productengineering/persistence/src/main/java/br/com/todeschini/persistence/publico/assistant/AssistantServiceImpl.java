package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.domain.business.publico.assistant.ChatResponseDTO;
import br.com.todeschini.domain.business.publico.assistant.ContextProvider;
import br.com.todeschini.domain.business.publico.assistant.api.EnviarMensagem;
import br.com.todeschini.domain.business.publico.assistant.api.LLMIntegration;
import br.com.todeschini.domain.exceptions.OllamaOfflineException;
import br.com.todeschini.domain.exceptions.OllamaTimeoutException;
import br.com.todeschini.domain.metadata.DomainService;
import br.com.todeschini.persistence.entities.publico.User;
import br.com.todeschini.persistence.entities.publico.assistant.Conversation;
import br.com.todeschini.persistence.entities.publico.assistant.Message;
import br.com.todeschini.persistence.publico.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;

/**
 * Implementação do serviço principal do assistente IA.
 *
 * Orquestra o fluxo completo de processamento de mensagens:
 * 1. Validação e busca do usuário
 * 2. Busca ou criação de conversa ativa
 * 3. Persistência da mensagem do usuário
 * 4. Construção de prompt context-aware
 * 5. Chamada ao LLM (Ollama)
 * 6. Persistência da resposta do assistente
 * 7. Retorno do DTO com resposta e conversationId
 *
 */
@Slf4j
@Service
@DomainService
@RequiredArgsConstructor
public class AssistantServiceImpl implements EnviarMensagem {

    private final LLMIntegration ollamaIntegration;
    private final ContextProvider contextProvider;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    /**
     * Processa mensagem do usuário e retorna resposta do assistente.
     *
     * @param username email do usuário autenticado
     * @param message mensagem do usuário
     * @param pageContext pathname da página atual
     * @return DTO com resposta e conversationId
     * @throws OllamaOfflineException se Ollama indisponível (HTTP 503)
     * @throws OllamaTimeoutException se timeout excedido (HTTP 504)
     * @throws IllegalArgumentException se parâmetros inválidos
     */
    @Override
    @Transactional
    public ChatResponseDTO execute(String username, String message, String pageContext) {
        // Validar parâmetros
        validateParameters(username, message);

        log.info("Processing message from user: {}, pageContext: {}", username, pageContext);

        // Buscar usuário
        User user = findUserByEmail(username);

        // Buscar ou criar conversa ativa
        Conversation conversation = findOrCreateActiveConversation(user);

        // Persistir mensagem do usuário
        Message userMessage = createUserMessage(conversation, message, pageContext);
        messageRepository.save(userMessage);

        log.debug("User message persisted: conversationId={}, messageId={}",
            conversation.getId(), userMessage.getId());

        // Construir prompt context-aware
        String userRole = getUserRole(user);
        String prompt = contextProvider.buildPrompt(message, pageContext, userRole);

        log.debug("Prompt built: length={}", prompt.length());

        // Chamar LLM
        // Exceções OllamaOfflineException e OllamaTimeoutException propagam automaticamente
        String assistantReply = ollamaIntegration.generate(prompt);

        log.info("Assistant reply generated: length={}", assistantReply.length());

        // Persistir resposta do assistente
        Message assistantMessage = createAssistantMessage(conversation, assistantReply);
        messageRepository.save(assistantMessage);

        // Atualizar timestamp da conversa
        conversation.setAtualizadoEm(LocalDateTime.now());
        conversationRepository.save(conversation);

        log.info("Message processing completed successfully: conversationId={}",
            conversation.getId());

        return ChatResponseDTO.builder()
            .reply(assistantReply)
            .conversationId(conversation.getId())
            .build();
    }

    /**
     * Valida parâmetros de entrada.
     */
    private void validateParameters(String username, String message) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }

        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be null or empty");
        }

        if (message.length() > 2000) {
            throw new IllegalArgumentException("Message cannot exceed 2000 characters");
        }
    }

    /**
     * Busca usuário por email.
     */
    private User findUserByEmail(String email) {
        Collection<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) {
            log.error("User not found: {}", email);
            throw new IllegalArgumentException("User not found: " + email);
        }
        return users.iterator().next();
    }

    /**
     * Busca conversa ativa do usuário ou cria uma nova.
     *
     * Considera "ativa" a conversa mais recente (última atualização).
     */
    private Conversation findOrCreateActiveConversation(User user) {
        // Buscar conversas do usuário ordenadas por atualização
        var conversations = conversationRepository.findByUsuarioIdOrderByAtualizadoEmDesc(user.getId());

        if (!conversations.isEmpty()) {
            // Retornar conversa mais recente
            return conversations.get(0);
        }

        // Criar nova conversa
        log.info("Creating new conversation for user: {}", user.getEmail());

        Conversation newConversation = Conversation.builder()
            .usuario(user)
            .titulo("Conversa " + LocalDateTime.now().toString())
            .build();

        return conversationRepository.save(newConversation);
    }

    /**
     * Cria mensagem do usuário.
     */
    private Message createUserMessage(Conversation conversation, String content, String pageContext) {
        return Message.builder()
            .conversation(conversation)
            .role("user")
            .content(content)
            .contextoPagina(pageContext)
            .build();
    }

    /**
     * Cria mensagem do assistente.
     */
    private Message createAssistantMessage(Conversation conversation, String content) {
        return Message.builder()
            .conversation(conversation)
            .role("assistant")
            .content(content)
            .build();
    }

    /**
     * Extrai role/papel do usuário do sistema de roles existente.
     */
    private String getUserRole(User user) {
        if (user.hasRole("ROLE_ADMIN")) {
            return "Admin";
        } else if (user.hasRole("ROLE_ANALYST")) {
            return "Analyst";
        } else if (user.hasRole("ROLE_OPERATOR")) {
            return "Operator";
        }
        return "User";
    }
}
