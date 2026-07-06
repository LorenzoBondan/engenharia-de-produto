package br.com.todeschini.domain.business.publico.cola.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.cola.DCola;

import java.util.Collection;

public interface CrudCola extends SimpleCrud<DCola, Integer> {

    Collection<DCola> pesquisarPorDescricao (String descricao);
}
