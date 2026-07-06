package br.com.todeschini.domain.business.publico.maquina.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;

import java.util.Collection;

public interface CrudMaquina extends SimpleCrud<DMaquina, Integer> {

    Collection<DMaquina> pesquisarPorNome (String nome);
}
