package br.com.todeschini.domain.business.publico.useranexo.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;

public interface BuscarUserAnexo {

    DUserAnexo buscar (Integer id);
    Paged<DUserAnexo> buscar(PageableRequest request);
}
