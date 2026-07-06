package br.com.todeschini.domain.business.publico.tnt.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.tnt.DTnt;

public interface BuscarTnt {

    DTnt buscar (Integer id);
    Paged<DTnt> buscar(PageableRequest request);
}
