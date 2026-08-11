package br.com.todeschini.webapi.config;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.util.Timeout;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Configuração do RestTemplate para integração com Ollama LLM local.
 *
 * Este bean é utilizado pelo OllamaIntegrationService para comunicação
 * HTTP com a API REST do Ollama (localhost:11434).
 *
 * Timeouts configurados conforme requisitos de performance:
 * - Connection timeout: 10 segundos
 * - Response timeout: 60 segundos (aumentado para Docker)
 */
@Configuration
public class RestTemplateConfig {

    /**
     * Cria bean RestTemplate com timeouts configurados para integração com Ollama.
     *
     * Utiliza Apache HttpClient 5 com RequestConfig personalizado para definir
     * timeouts de conexão e resposta.
     *
     * @return RestTemplate configurado com HttpComponentsClientHttpRequestFactory
     */
    @Bean
    public RestTemplate ollamaRestTemplate() {
        // Configure timeouts using Apache HttpClient 5 API
        RequestConfig requestConfig = RequestConfig.custom()
            .setConnectTimeout(Timeout.ofSeconds(10))       // Connection timeout: 10s
            .setResponseTimeout(Timeout.ofSeconds(60))      // Response timeout: 60s (Docker pode ser mais lento)
            .build();

        HttpClient httpClient = HttpClients.custom()
            .setDefaultRequestConfig(requestConfig)
            .build();

        HttpComponentsClientHttpRequestFactory factory =
            new HttpComponentsClientHttpRequestFactory(httpClient);

        return new RestTemplate(factory);
    }
}
