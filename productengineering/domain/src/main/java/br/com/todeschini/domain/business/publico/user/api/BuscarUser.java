package br.com.todeschini.domain.business.publico.user.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.user.DUser;

public interface BuscarUser {

    DUser buscar (Integer id);
    DUser buscar (String email);
    Paged<DUser> buscar(PageableRequest request);
    DUser findMe();
}
