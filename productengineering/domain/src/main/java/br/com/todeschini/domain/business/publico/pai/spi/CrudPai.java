package br.com.todeschini.domain.business.publico.pai.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.pai.DPai;

import java.util.Collection;
import java.util.List;

public interface CrudPai extends SimpleCrud<DPai, Integer> {

    Collection<DPai> pesquisarPorDescricao (String descricao);
    List<DPai> buscarPorModelo(Integer cdmodelo);
    List<DPai> buscarPorCategoriaComponente(Integer cdcategoriaComponente);
}
