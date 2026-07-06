package br.com.todeschini.domain.business.publico.assistant;

import br.com.todeschini.domain.metadata.DomainService;

import java.util.HashMap;
import java.util.Map;

/**
 * Provedor de contexto para o assistente IA.
 *
 * Constrói prompts context-aware baseados na página atual do usuário
 * e seu papel no sistema, gerando prompts especializados que melhoram
 * a qualidade das respostas do LLM.
 *
 */
@DomainService
public class ContextProvider {

    private static final int MAX_PROMPT_LENGTH = 2000;
    private static final String SYSTEM_INSTRUCTION =
        "Você é um assistente especializado no sistema Product Engineering para indústria moveleira.\n\n";
    private static final String NAVIGATION_GUIDE =
        "GUIA DE NAVEGAÇÃO DO SISTEMA:\n" +
        "• Para cadastrar CHAPAS MDP → acesse /sheets\n" +
        "• Para cadastrar FITAS DE BORDA → acesse /edgebandings\n" +
        "• Para cadastrar CORES → acesse /colors\n" +
        "• Para cadastrar MODELOS → acesse /models\n" +
        "• Para cadastrar MEDIDAS → acesse /measures\n" +
        "• Para cadastrar ITENS PAI (produtos) → acesse /fathers\n" +
        "• Para cadastrar ITENS FILHO (componentes) → acesse /sons\n" +
        "• Para criar ESTRUTURAS (BOM) → acesse /homestructs\n" +
        "• Para criar ROTEIROS de produção → acesse /guides\n" +
        "• Para cadastrar MÁQUINAS → acesse /machines\n" +
        "• Para cadastrar ACESSÓRIOS → acesse /accessories\n\n";
    private static final String DEFAULT_INSTRUCTIONS =
        "INSTRUÇÕES:\n" +
        "- Seja ESPECÍFICO ao indicar onde acessar funcionalidades\n" +
        "- Sempre indique a rota correta (ex: /sheets, /fathers)\n" +
        "- Se o usuário perguntar 'onde cadastrar X', indique a rota exata\n" +
        "- Seja conciso e direto\n" +
        "- Use exemplos práticos quando relevante\n" +
        "- Responda em português (pt-BR)\n\n";

    private final Map<String, String> contextMap = new HashMap<>();

    public ContextProvider() {
        initializeContextMap();
    }

    /**
     * Constrói um prompt context-aware para o LLM.
     *
     * @param userMessage mensagem do usuário
     * @param pageContext pathname da página atual (ex: "/sheets", "/fathers")
     * @param userRole papel do usuário no sistema (Admin, Analyst, Operator)
     * @return prompt formatado com contexto e limitado a 2000 caracteres
     */
    public String buildPrompt(String userMessage, String pageContext, String userRole) {
        StringBuilder prompt = new StringBuilder();

        // System instruction
        prompt.append(SYSTEM_INSTRUCTION);

        // Context da página
        String contextDescription = mapPageContext(pageContext);
        prompt.append("Contexto: ").append(contextDescription).append("\n");

        // User role
        if (userRole != null && !userRole.isEmpty()) {
            prompt.append("Papel do usuário: ").append(userRole).append("\n\n");
        }

        // Guia de navegação
        prompt.append(NAVIGATION_GUIDE);

        // Instruções
        prompt.append(DEFAULT_INSTRUCTIONS);

        // User message
        prompt.append("Usuário: ").append(userMessage);

        // Truncar se necessário
        return truncatePrompt(prompt.toString(), userMessage);
    }

    /**
     * Mapeia pathname da página para descrição contextual.
     *
     * @param pageContext pathname (ex: "/sheets", "/fathers")
     * @return descrição da página atual
     */
    private String mapPageContext(String pageContext) {
        if (pageContext == null || pageContext.isEmpty()) {
            return "Sistema Product Engineering - gerenciamento de engenharia de produto";
        }

        return contextMap.getOrDefault(
            pageContext,
            "Sistema Product Engineering - gerenciamento de engenharia de produto"
        );
    }

    /**
     * Trunca o prompt para respeitar limite de 2000 caracteres.
     *
     * Se o prompt exceder o limite, trunca a mensagem do usuário
     * proporcionalmente mantendo o contexto do sistema.
     *
     * @param fullPrompt prompt completo
     * @param userMessage mensagem original do usuário
     * @return prompt truncado se necessário
     */
    private String truncatePrompt(String fullPrompt, String userMessage) {
        if (fullPrompt.length() <= MAX_PROMPT_LENGTH) {
            return fullPrompt;
        }

        // Calcular quanto de espaço resta para a mensagem do usuário
        int systemContextLength = fullPrompt.length() - userMessage.length();
        int availableForMessage = MAX_PROMPT_LENGTH - systemContextLength - 20; // -20 para "... (truncado)"

        if (availableForMessage <= 0) {
            // Contexto do sistema é muito grande, reduzir drasticamente
            return fullPrompt.substring(0, MAX_PROMPT_LENGTH - 20) + "\n... (truncado)";
        }

        // Truncar apenas a mensagem do usuário
        String truncatedMessage = userMessage.substring(0, Math.min(userMessage.length(), availableForMessage));
        return fullPrompt.substring(0, systemContextLength)
            + truncatedMessage
            + "\n... (truncado)";
    }

    /**
     * Inicializa o mapeamento de pathnames para descrições contextuais.
     */
    private void initializeContextMap() {
        // Materiais
        contextMap.put("/sheets", "Página de Chapas MDP - cadastro e gerenciamento de chapas de madeira");
        contextMap.put("/materials", "Página de Materiais - gestão de materiais diversos (MDP, MDF, Alumínio)");
        contextMap.put("/edgebands", "Página de Fitas de Borda - cadastro de fitas para acabamento");

        // Itens
        contextMap.put("/fathers", "Página de Itens Pai - itens principais/produtos do sistema");
        contextMap.put("/sons", "Página de Itens Filho - componentes que formam os Itens Pai");

        // Estruturas e Roteiros
        contextMap.put("/homestructs", "Página de Estruturas - geração de BOM (Bill of Materials)");
        contextMap.put("/scripts", "Página de Roteiros - sequência de operações de produção");
        contextMap.put("/machines", "Página de Máquinas - cadastro de máquinas e equipamentos");

        // Cadastros auxiliares
        contextMap.put("/colors", "Página de Cores - cadastro de cores disponíveis");
        contextMap.put("/models", "Página de Modelos - tipos de produtos");
        contextMap.put("/measures", "Página de Medidas - dimensões padronizadas");
        contextMap.put("/accessories", "Página de Acessórios - peças adicionais");

        // Administrativo
        contextMap.put("/users", "Página de Usuários - gestão de usuários do sistema");
        contextMap.put("/trash", "Lixeira - itens excluídos temporariamente");
    }
}
