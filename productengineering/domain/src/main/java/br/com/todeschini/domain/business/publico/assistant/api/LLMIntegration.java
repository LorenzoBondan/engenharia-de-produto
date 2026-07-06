package br.com.todeschini.domain.business.publico.assistant.api;

import br.com.todeschini.domain.exceptions.OllamaOfflineException;
import br.com.todeschini.domain.exceptions.OllamaTimeoutException;

public interface LLMIntegration {

    /**
     * Gera uma resposta baseada no prompt fornecido.
     *
     * @param prompt texto de entrada para o modelo processar
     * @return resposta gerada pelo LLM
     * @throws OllamaOfflineException se o serviço estiver indisponível
     * @throws OllamaTimeoutException se a requisição exceder o timeout
     */
    String generate(String prompt);
}
