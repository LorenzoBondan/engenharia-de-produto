package br.com.todeschini.domain.business.publico.polietileno.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

import java.util.Collection;

public interface CrudPolietileno extends SimpleCrud<DPolietileno, Integer> {

    Collection<DPolietileno> pesquisarPorDescricao (String descricao);
}
