package br.com.todeschini.domain.business.publico.cola.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.cola.DCola;

public interface BuscarCola {

    DCola buscar (Integer id);
    Paged<DCola> buscar(PageableRequest request);
}
