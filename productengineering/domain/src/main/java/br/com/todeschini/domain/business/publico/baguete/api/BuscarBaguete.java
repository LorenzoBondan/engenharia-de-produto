package br.com.todeschini.domain.business.publico.baguete.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.baguete.DBaguete;

public interface BuscarBaguete {

    DBaguete buscar (Integer id);
    Paged<DBaguete> buscar(PageableRequest request);
}
