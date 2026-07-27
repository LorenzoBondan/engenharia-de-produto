package br.com.todeschini.persistence.util;

/**
 * Utilitários para manipulação de strings, incluindo conversão entre diferentes convenções de nomenclatura.
 */
public class StringUtils {

    /**
     * Converte um nome de campo em `camelCase` para `snake_case`.
     *
     * @param camelCase Nome do campo em `camelCase`.
     * @return Nome do campo convertido para `snake_case`.
     */
    public static String toSnakeCase(String camelCase) {
        StringBuilder result = new StringBuilder();

        for (char ch : camelCase.toCharArray()) {
            if (Character.isUpperCase(ch)) {
                result.append('_').append(Character.toLowerCase(ch));
            } else {
                result.append(ch);
            }
        }

        return result.toString();
    }

    /**
     * Converte um nome de campo em `snake_case` para `camelCase`.
     *
     * @param snakeCase Nome do campo em `snake_case`.
     * @return Nome do campo convertido para `camelCase`.
     */
    public static String toCamelCase(String snakeCase) {
        StringBuilder result = new StringBuilder();
        boolean toUpperCase = false;

        for (char ch : snakeCase.toCharArray()) {
            if (ch == '_') {
                toUpperCase = true;
            } else {
                if (toUpperCase) {
                    result.append(Character.toUpperCase(ch));
                    toUpperCase = false;
                } else {
                    result.append(ch);
                }
            }
        }

        return result.toString();
    }

    /**
     * Converte um nome de classe em camelCase.
     * Remove o prefixo 'cd' e converte o restante para camelCase.
     *
     * @param className Nome da classe para ser convertido.
     * @return Nome da classe em camelCase.
     */
    public static String convertToCamelCase(String className) {
        if (className.startsWith("cd")) {
            className = className.substring(2); // Remove o prefixo 'cd'
        }

        return Character.toLowerCase(className.charAt(0)) + className.substring(1);
    }
}

