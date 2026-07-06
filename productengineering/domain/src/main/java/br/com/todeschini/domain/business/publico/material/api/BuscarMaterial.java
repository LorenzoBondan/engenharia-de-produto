package br.com.todeschini.domain.business.publico.material.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.material.DMaterial;

public interface BuscarMaterial {

    DMaterial buscar (Integer id);
    Paged<DMaterial> buscar(PageableRequest request);
}
