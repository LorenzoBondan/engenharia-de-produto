package br.com.todeschini.domain.business.publico.polietileno.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

public interface BuscarPolietileno {

    DPolietileno buscar (Integer id);
    Paged<DPolietileno> buscar(PageableRequest request);
}
