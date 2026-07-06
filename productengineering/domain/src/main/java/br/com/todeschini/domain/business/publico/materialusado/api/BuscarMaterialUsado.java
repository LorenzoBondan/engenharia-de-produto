package br.com.todeschini.domain.business.publico.materialusado.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;

public interface BuscarMaterialUsado {

    DMaterialUsado buscar (Integer id);
    Paged<DMaterialUsado> buscar(PageableRequest request);
}
