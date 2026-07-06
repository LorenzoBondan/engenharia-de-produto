package br.com.todeschini.domain.business.publico.roteiro.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.util.Collection;

public interface CrudRoteiro extends SimpleCrud<DRoteiro, Integer> {

    Collection<DRoteiro> pesquisarPorDescricao (String descricao);
    Boolean existePorDescricao (String descricao);
}
