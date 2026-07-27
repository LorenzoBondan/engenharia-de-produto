package br.com.todeschini.persistence.entities.enums;

/**
 * Criado para fazer com que todos os enums o implementem. Dessa forma, é possível recuperar o enum no buscarHistorico e substituirPorVersaoAntiga, já que todos serão deste tipo
 */
public interface MappableEnum {
    int getValue();
}
