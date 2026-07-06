package br.com.todeschini.domain.business.publico.baguete.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.baguete.DBaguete;

import java.util.Collection;

public interface CrudBaguete extends SimpleCrud<DBaguete, Integer> {

    Collection<DBaguete> pesquisarPorDescricao (String descricao);
}
