package br.com.todeschini.domain.business.publico.maquina.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;

public interface BuscarMaquina {

    DMaquina buscar (Integer id);
    Paged<DMaquina> buscar(PageableRequest request);
}
