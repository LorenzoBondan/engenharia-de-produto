package br.com.todeschini.domain.business.publico.lixeira.api;

public interface CriarLixeira {

    <T> void incluir(T entity) throws IllegalAccessException;
}
