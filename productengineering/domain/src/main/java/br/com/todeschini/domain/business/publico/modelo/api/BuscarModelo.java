package br.com.todeschini.domain.business.publico.modelo.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.modelo.DModelo;

public interface BuscarModelo {

    DModelo buscar (Integer id);
    Paged<DModelo> buscar(PageableRequest request);
}
