package br.com.todeschini.domain.business.publico.cantoneira.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;

public interface BuscarCantoneira {

    DCantoneira buscar (Integer id);
    Paged<DCantoneira> buscar(PageableRequest request);
}
