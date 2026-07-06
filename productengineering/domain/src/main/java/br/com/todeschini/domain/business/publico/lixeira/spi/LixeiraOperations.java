package br.com.todeschini.domain.business.publico.lixeira.spi;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;

import java.util.Map;

public interface LixeiraOperations {

    Paged<DLixeira> buscar(PageableRequest request);
    <T> void incluir(T entity) throws IllegalAccessException;
    <T> void recuperar(Integer id, Boolean recuperarDependencias);
    <T> void recuperarPorEntidadeId(Map<String, Object> entidadeid, Boolean recuperarDependencias);
    <T> void remover(T entity) throws IllegalAccessException;
}
