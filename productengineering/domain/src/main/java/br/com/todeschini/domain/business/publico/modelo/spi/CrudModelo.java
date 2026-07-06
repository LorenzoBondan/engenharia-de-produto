package br.com.todeschini.domain.business.publico.modelo.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.modelo.DModelo;

import java.util.Collection;

public interface CrudModelo extends SimpleCrud<DModelo, Integer> {

    Collection<DModelo> pesquisarPorDescricao (String descricao);
}
