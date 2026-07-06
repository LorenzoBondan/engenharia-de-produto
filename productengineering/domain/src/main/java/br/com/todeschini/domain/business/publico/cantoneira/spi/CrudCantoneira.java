package br.com.todeschini.domain.business.publico.cantoneira.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;

import java.util.Collection;

public interface CrudCantoneira extends SimpleCrud<DCantoneira, Integer> {

    Collection<DCantoneira> pesquisarPorDescricao (String descricao);
}
