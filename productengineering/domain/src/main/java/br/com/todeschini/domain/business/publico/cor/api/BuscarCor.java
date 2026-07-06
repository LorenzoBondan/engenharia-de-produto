package br.com.todeschini.domain.business.publico.cor.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.cor.DCor;

public interface BuscarCor {

    DCor buscar (Integer id);
    Paged<DCor> buscar(PageableRequest request);
}
