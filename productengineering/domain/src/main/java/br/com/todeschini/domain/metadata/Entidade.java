package br.com.todeschini.domain.metadata;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anotação para marcar entidades como atributos (dependências) que podem ser editados em lote.
 * Criado para que o ServiceImpl tenha acesso à essa anotação (diferente do @Entity do pacote persistence)
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Entidade {
}
