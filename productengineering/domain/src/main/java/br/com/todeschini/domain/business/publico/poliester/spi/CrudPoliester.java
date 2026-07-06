package br.com.todeschini.domain.business.publico.poliester.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;

import java.util.Collection;

public interface CrudPoliester extends SimpleCrud<DPoliester, Integer> {

    Collection<DPoliester> pesquisarPorDescricao (String descricao);
}
