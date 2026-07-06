package br.com.todeschini.domain.business.publico.filho.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.filho.DFilho;

public interface BuscarFilho {

    DFilho buscar (Integer id);
    Paged<DFilho> buscar(PageableRequest request);
}
