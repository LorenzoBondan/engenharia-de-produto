package br.com.todeschini.domain.business.publico.acessorio.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;

import java.util.Collection;

public interface CrudAcessorio extends SimpleCrud<DAcessorio, Integer> {

    Collection<DAcessorio> pesquisarPorDescricao (String descricao);
}
