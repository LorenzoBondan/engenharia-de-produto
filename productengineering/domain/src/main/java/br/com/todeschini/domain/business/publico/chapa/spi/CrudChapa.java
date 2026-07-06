package br.com.todeschini.domain.business.publico.chapa.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.chapa.DChapa;

import java.util.Collection;

public interface CrudChapa extends SimpleCrud<DChapa, Integer> {

    Collection<DChapa> pesquisarPorDescricao (String descricao);
}
