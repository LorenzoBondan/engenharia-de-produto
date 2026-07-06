package br.com.todeschini.domain.business.publico.roteiro.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.util.Collection;

public interface BuscarRoteiro {

    DRoteiro buscar (Integer id);
    Paged<DRoteiro> buscar(PageableRequest request);
    Collection<? extends DRoteiro> buscarPorDescricao (String descricao);
    Boolean existePorDescricao (String descricao);
}
