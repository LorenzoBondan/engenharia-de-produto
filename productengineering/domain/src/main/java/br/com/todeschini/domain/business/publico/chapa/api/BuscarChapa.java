package br.com.todeschini.domain.business.publico.chapa.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.chapa.DChapa;

public interface BuscarChapa {

    DChapa buscar (Integer id);
    Paged<DChapa> buscar(PageableRequest request);
}
