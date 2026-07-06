package br.com.todeschini.domain.business.publico.poliester.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;

public interface BuscarPoliester {

    DPoliester buscar (Integer id);
    Paged<DPoliester> buscar(PageableRequest request);
}
