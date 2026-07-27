package br.com.todeschini.persistence.publico.assistant;

import br.com.todeschini.domain.business.publico.assistant.api.LLMIntegration;
import br.com.todeschini.domain.exceptions.OllamaOfflineException;
import br.com.todeschini.domain.exceptions.OllamaTimeoutException;
import br.com.todeschini.domain.metadata.DomainService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Implementação da integração com Ollama LLM local.
 *
 * Realiza requisições HTTP POST para o Ollama (configurável via OLLAMA_URL)
 * utilizando o modelo Llama 3.2 3B com configurações otimizadas.
 *
 */
@Slf4j
@Service
@DomainService
@RequiredArgsConstructor
public class OllamaIntegrationService implements LLMIntegration {

    @Value("${ollama.url:http://localhost:11434/api/generate}")
    private String ollamaUrl;
    private static final String MODEL_NAME = "llama3.2:3b";
    private static final double TEMPERATURE = 0.7;
    private static final int MAX_TOKENS = 500;
    private static final long WARN_LATENCY_MS = 10000; // 10 segundos

    private final RestTemplate ollamaRestTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Gera resposta do Ollama baseada no prompt fornecido.
     *
     * @param prompt texto de entrada para o modelo
     * @return resposta gerada pelo LLM
     * @throws OllamaOfflineException se Ollama estiver offline
     * @throws OllamaTimeoutException se requisição exceder timeout
     */
    @Override
    public String generate(String prompt) {
        long startTime = System.currentTimeMillis();

        try {
            // Montar request JSON
            Map<String, Object> requestBody = buildRequest(prompt);

            log.debug("Enviando requisição para Ollama: model={}, promptLength={}",
                MODEL_NAME, prompt.length());

            // Fazer POST para Ollama
            String response = ollamaRestTemplate.postForObject(
                ollamaUrl,
                requestBody,
                String.class
            );

            // Extrair resposta do JSON
            String generatedText = extractResponse(response);

            // Log de latência
            long latency = System.currentTimeMillis() - startTime;
            if (latency > WARN_LATENCY_MS) {
                log.warn("Ollama response took {}ms (>{}ms threshold)", latency, WARN_LATENCY_MS);
            } else {
                log.info("Ollama response received in {}ms", latency);
            }

            return generatedText;

        } catch (ResourceAccessException e) {
            // Verificar se é connection refused ou timeout
            String errorMessage = e.getMessage() != null ? e.getMessage().toLowerCase() : "";

            if (errorMessage.contains("connection refused") ||
                errorMessage.contains("connect to")) {
                // Ollama não está rodando (Requirement 19.1)
                log.error("Ollama service offline (connection refused): {}", e.getMessage());
                throw new OllamaOfflineException(
                    "Serviço Ollama não está disponível em " + ollamaUrl, e
                );
            } else {
                // Timeout real (Requirement 19.2)
                log.error("Ollama request timeout: {}", e.getMessage());
                throw new OllamaTimeoutException(
                    "Requisição ao Ollama excedeu o timeout de 10 segundos", e
                );
            }

        } catch (HttpClientErrorException e) {
            // Ollama offline ou erro HTTP (Requirement 19.1)
            log.error("Ollama service unavailable: status={}, message={}",
                e.getStatusCode(), e.getMessage());
            throw new OllamaOfflineException(
                "Serviço Ollama não está disponível em " + ollamaUrl, e
            );

        } catch (Exception e) {
            // Outros erros (parsing JSON, etc)
            log.error("Unexpected error calling Ollama: {}", e.getMessage(), e);
            throw new OllamaOfflineException(
                "Erro inesperado ao comunicar com Ollama: " + e.getMessage(), e
            );
        }
    }

    /**
     * Constrói o corpo da requisição JSON para o Ollama.
     *
     * @param prompt prompt do usuário
     * @return Map representando o JSON
     */
    private Map<String, Object> buildRequest(String prompt) {
        Map<String, Object> request = new HashMap<>();
        request.put("model", MODEL_NAME);
        request.put("prompt", prompt);
        request.put("stream", false); // Requisição síncrona

        // Opções do modelo
        Map<String, Object> options = new HashMap<>();
        options.put("temperature", TEMPERATURE);
        options.put("num_predict", MAX_TOKENS);
        request.put("options", options);

        return request;
    }

    /**
     * Extrai o campo "response" do JSON retornado pelo Ollama.
     *
     * @param jsonResponse JSON string retornado pelo Ollama
     * @return texto gerado pelo modelo
     * @throws RuntimeException se parsing falhar
     */
    private String extractResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode responseNode = root.get("response");

            if (responseNode == null || responseNode.isNull()) {
                log.error("Ollama response missing 'response' field: {}", jsonResponse);
                throw new OllamaOfflineException("Resposta do Ollama está incompleta");
            }

            return responseNode.asText();

        } catch (Exception e) {
            log.error("Failed to parse Ollama response: {}", e.getMessage());
            throw new OllamaOfflineException(
                "Erro ao processar resposta do Ollama: " + e.getMessage(), e
            );
        }
    }
}
