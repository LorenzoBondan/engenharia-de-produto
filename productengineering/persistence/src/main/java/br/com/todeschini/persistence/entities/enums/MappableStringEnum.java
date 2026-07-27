package br.com.todeschini.persistence.entities.enums;

/**
 * é possível recuperar o enum no buscarHistorico e substituirPorVersaoAntiga, onde salvamos a label do enum
 */
public interface MappableStringEnum {
    String getLabel();
}
