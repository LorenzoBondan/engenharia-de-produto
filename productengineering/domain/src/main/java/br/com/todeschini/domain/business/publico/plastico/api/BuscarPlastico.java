package br.com.todeschini.domain.business.publico.plastico.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;

public interface BuscarPlastico {

    DPlastico buscar (Integer id);
    Paged<DPlastico> buscar(PageableRequest request);
}
