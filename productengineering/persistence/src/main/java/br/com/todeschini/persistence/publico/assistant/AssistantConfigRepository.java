package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.persistence.entities.publico.assistant.AssistantConfig;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AssistantConfigRepository extends CrudRepository<AssistantConfig, Integer> {

    /**
     * Busca configuração do assistente para um usuário específico.
     *
     * Cada usuário possui no máximo uma configuração (usuario_id UNIQUE).
     *
     * @param usuarioId ID do usuário
     * @return Optional com a configuração se encontrada
     */
    Optional<AssistantConfig> findByUsuarioId(Integer usuarioId);

    /**
     * Verifica se usuário já possui configuração.
     *
     * @param usuarioId ID do usuário
     * @return true se configuração existir
     */
    boolean existsByUsuarioId(Integer usuarioId);
}
