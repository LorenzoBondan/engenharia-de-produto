package br.com.todeschini.domain.business.publico.useranexo.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;

import java.util.Collection;

public interface CrudUserAnexo extends SimpleCrud<DUserAnexo, Integer> {

    Collection<DUserAnexo> pesquisarPorUserEAnexo (Integer cduser, Integer cdanexo);
}
