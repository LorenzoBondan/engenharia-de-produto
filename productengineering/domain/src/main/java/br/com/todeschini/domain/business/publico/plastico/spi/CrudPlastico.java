package br.com.todeschini.domain.business.publico.plastico.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;

import java.util.Collection;

public interface CrudPlastico extends SimpleCrud<DPlastico, Integer> {

    Collection<DPlastico> pesquisarPorDescricao (String descricao);
}
