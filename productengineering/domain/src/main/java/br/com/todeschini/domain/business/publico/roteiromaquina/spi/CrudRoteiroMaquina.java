package br.com.todeschini.domain.business.publico.roteiromaquina.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

import java.util.Collection;

public interface CrudRoteiroMaquina extends SimpleCrud<DRoteiroMaquina, Integer> {

    Collection<DRoteiroMaquina> pesquisarPorRoteiroEMaquina (Integer cdroteiro, Integer cdmaquina);
}
