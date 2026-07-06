package br.com.todeschini.domain.business.publico.fitaborda.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;

import java.util.Collection;

public interface CrudFitaBorda extends SimpleCrud<DFitaBorda, Integer> {

    Collection<DFitaBorda> pesquisarPorDescricao (String descricao);
}
