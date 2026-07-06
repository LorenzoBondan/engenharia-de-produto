package br.com.todeschini.domain.business.publico.filho.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.filho.DFilho;

import java.util.Collection;
import java.util.List;

public interface CrudFilho extends SimpleCrud<DFilho, Integer> {

    Collection<DFilho> pesquisarPorDescricaoECorEMedidas (String descricao, Integer cdcor, Integer cdmedidas);
    List<DFilho> pesquisarPorDescricaoEMedidas (String descricao, Integer cdmedidas);
}
