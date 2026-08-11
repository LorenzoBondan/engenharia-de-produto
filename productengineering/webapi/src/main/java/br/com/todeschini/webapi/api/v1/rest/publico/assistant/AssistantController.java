package br.com.todeschini.webapi.api.v1.rest.publico.assistant;

import br.com.todeschini.domain.business.publico.assistant.ChatResponseDTO;
import br.com.todeschini.domain.business.publico.assistant.api.EnviarMensagem;
import br.com.todeschini.persistence.util.CustomUserUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {

    private final EnviarMensagem enviarMensagem;
    private final CustomUserUtil customUserUtil;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(
        @Valid @RequestBody ChatRequestDTO request
    ) {
        String username = customUserUtil.getLoggedUsername();

        log.info("Chat request from user: {}, pageContext: {}", username, request.getPageContext());

        ChatResponseDTO response = enviarMensagem.execute(
            username,
            request.getMessage(),
            request.getPageContext()
        );

        return ResponseEntity.ok(response);
    }
}
