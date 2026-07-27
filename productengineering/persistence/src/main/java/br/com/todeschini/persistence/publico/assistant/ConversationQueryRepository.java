package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.domain.metadata.QueryService;
import br.com.todeschini.persistence.entities.publico.assistant.Conversation;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

@QueryService
public interface ConversationQueryRepository
    extends PagingAndSortingRepository<Conversation, Integer>,
            JpaSpecificationExecutor<Conversation> {
}
