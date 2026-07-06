package br.com.todeschini.domain.exceptions;

/**
 * Exceção lançada quando a requisição ao Ollama excede o timeout configurado.
 *
 * Indica que o tempo de resposta ultrapassou o limite de 10 segundos
 * configurado no RestTemplate.
 *
 */
public class OllamaTimeoutException extends RuntimeException {

    public OllamaTimeoutException(String message) {
        super(message);
    }

    public OllamaTimeoutException(String message, Throwable cause) {
        super(message, cause);
    }
}
