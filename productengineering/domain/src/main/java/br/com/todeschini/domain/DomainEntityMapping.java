package br.com.todeschini.domain;

/**
 * Interface utilizada para recuperar qual entidade se refere o domain a ser editado em lote que vêm no método de edição em lote
 */
public interface DomainEntityMapping {

    Class<?> getEntityClass(Class<?> domainClass);
}
