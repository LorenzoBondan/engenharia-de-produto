package br.com.todeschini.domain.business.publico.role.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.role.DRole;

public interface BuscarRole {

    DRole buscar (Integer id);
    Paged<DRole> buscar(PageableRequest request);
}
