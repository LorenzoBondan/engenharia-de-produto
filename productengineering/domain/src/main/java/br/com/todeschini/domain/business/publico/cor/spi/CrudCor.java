package br.com.todeschini.domain.business.publico.cor.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.cor.DCor;

import java.util.Collection;

public interface CrudCor extends SimpleCrud<DCor, Integer> {

    Collection<DCor> pesquisarPorDescricao (String descricao);
}
