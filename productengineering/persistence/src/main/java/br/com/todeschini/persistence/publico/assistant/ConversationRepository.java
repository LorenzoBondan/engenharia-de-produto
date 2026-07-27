package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.persistence.entities.publico.assistant.Conversation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends CrudRepository<Conversation, Integer> {

    /**
     * Busca conversas de um usuário ordenadas por data de atualização (mais recente primeiro).
     *
     * @param usuarioId ID do usuário
     * @return lista de conversas do usuário
     */
    List<Conversation> findByUsuarioIdOrderByAtualizadoEmDesc(Integer usuarioId);

    /**
     * Busca uma conversa específica de um usuário (isolamento de dados).
     *
     * Garante que usuários só acessem suas próprias conversas.
     *
     * @param id ID da conversa
     * @param usuarioId ID do usuário
     * @return Optional com a conversa se encontrada e pertencer ao usuário
     */
    Optional<Conversation> findByIdAndUsuarioId(Integer id, Integer usuarioId);
}
