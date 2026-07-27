package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.persistence.entities.publico.assistant.Message;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MessageRepository extends CrudRepository<Message, Integer> {

    /**
     * Busca todas as mensagens de uma conversa ordenadas por data de criação.
     *
     * @param conversationId ID da conversa
     * @return lista de mensagens da conversa em ordem cronológica
     */
    List<Message> findByConversationIdOrderByCriadoEmAsc(Integer conversationId);
}
