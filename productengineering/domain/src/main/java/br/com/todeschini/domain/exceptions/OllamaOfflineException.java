package br.com.todeschini.domain.exceptions;

/**
 * Exceção lançada quando o serviço Ollama não está disponível.
 *
 * Indica que a conexão HTTP com o Ollama falhou (status 4xx/5xx)
 * ou o serviço não está rodando em localhost:11434.
 *
 */
public class OllamaOfflineException extends RuntimeException {

    public OllamaOfflineException(String message) {
        super(message);
    }

    public OllamaOfflineException(String message, Throwable cause) {
        super(message, cause);
    }
}
