package br.com.todeschini.persistence.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class StringUtilsTest {

    @Test
    void testToSnakeCase() {
        // Teste 1: camelCase para snake_case
        assertEquals("campo_exemplo", StringUtils.toSnakeCase("campoExemplo"));

        // Teste 2: camelCase com mais de uma palavra
        assertEquals("campo_exemplo_mais_palavras", StringUtils.toSnakeCase("campoExemploMaisPalavras"));

        // Teste 3: String sem letras maiúsculas
        assertEquals("campo", StringUtils.toSnakeCase("campo"));

        // Teste 4: String com apenas letras maiúsculas
        assertEquals("_c_a_m_p_o", StringUtils.toSnakeCase("CAMPO"));

        // Teste 5: String com caracteres especiais
        assertEquals("campo@_exemplo", StringUtils.toSnakeCase("campo@Exemplo"));
    }

    @Test
    void testToCamelCase() {
        // Teste 1: snake_case para camelCase
        assertEquals("campoExemplo", StringUtils.toCamelCase("campo_exemplo"));

        // Teste 2: snake_case com múltiplos sublinhados
        assertEquals("campoExemploMaisPalavras", StringUtils.toCamelCase("campo_exemplo_mais_palavras"));

        // Teste 3: snake_case sem sublinhado
        assertEquals("campo", StringUtils.toCamelCase("campo"));

        // Teste 4: String já em camelCase
        assertEquals("campoExemplo", StringUtils.toCamelCase("campoExemplo"));

        // Teste 5: Snake case com números
        assertEquals("campo1Exemplo2", StringUtils.toCamelCase("campo_1_exemplo_2"));
    }

    @Test
    void testConvertToCamelCase() {
        // Teste 1: Remover prefixo 'cd' e converter para camelCase
        assertEquals("exemplo", StringUtils.convertToCamelCase("cdExemplo"));

        // Teste 2: Nome da classe sem o prefixo 'cd'
        assertEquals("exemplo", StringUtils.convertToCamelCase("Exemplo"));

        // Teste 3: Classe com mais de um nome com prefixo 'cd'
        assertEquals("exemploComMaisPalavras", StringUtils.convertToCamelCase("cdExemploComMaisPalavras"));

        // Teste 4: Classe sem a parte 'cd' no nome
        assertEquals("exemploSimples", StringUtils.convertToCamelCase("ExemploSimples"));

        // Teste 5: Nome da classe começando com minúscula
        assertEquals("exemploSimples", StringUtils.convertToCamelCase("exemploSimples"));
    }
}

