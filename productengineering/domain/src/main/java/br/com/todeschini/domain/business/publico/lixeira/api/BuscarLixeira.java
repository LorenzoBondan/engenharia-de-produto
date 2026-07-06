package br.com.todeschini.domain.business.publico.lixeira.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.lixeira.DLixeira;

public interface BuscarLixeira {

    Paged<DLixeira> buscar(PageableRequest request);
}
