package br.com.todeschini.domain.business.publico.lixeira.api;

public interface RemoverLixeira {

    <T> void remover(T entity) throws IllegalAccessException;
}
