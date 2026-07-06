package br.com.todeschini.domain.business.publico.acessorio.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;

public interface BuscarAcessorio {

    DAcessorio buscar (Integer id);
    Paged<DAcessorio> buscar(PageableRequest request);
}
