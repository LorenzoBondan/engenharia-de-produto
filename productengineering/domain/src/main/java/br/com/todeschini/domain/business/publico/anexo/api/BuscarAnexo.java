package br.com.todeschini.domain.business.publico.anexo.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.anexo.DAnexo;

public interface BuscarAnexo {

    DAnexo buscar (Integer id);
    Paged<DAnexo> buscar(PageableRequest request);
}
