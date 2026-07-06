package br.com.todeschini.domain.business.publico.categoriacomponente.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;

import java.util.Collection;

public interface CrudCategoriaComponente extends SimpleCrud<DCategoriaComponente, Integer> {

    Collection<DCategoriaComponente> pesquisarPorDescricao (String descricao);
}
