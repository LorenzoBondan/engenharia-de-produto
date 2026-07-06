package br.com.todeschini.domain;

import java.lang.reflect.Field;

/**
 * Inteface utilizada para converter os valores que vêm no método de edição em lote para seus respectivos tipos
 */
public interface ConversaoValores {

    Object convertValor(Class<?> fieldType, Object valor);
    Convertable<?, ?> findAdapterForEntity(Class<?> entityClass);
    Field buscarCampoNaHierarquia(Class<?> clazz, String nomeCampo) throws NoSuchFieldException;
}
