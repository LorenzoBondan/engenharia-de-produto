package br.com.todeschini.domain.business.publico.grupomaquina.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;

import java.util.Collection;

public interface CrudGrupoMaquina extends SimpleCrud<DGrupoMaquina, Integer> {

    Collection<DGrupoMaquina> pesquisarPorNome (String nome);
}
