package br.com.todeschini.domain.business.publico.acessoriousado.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;

public interface BuscarAcessorioUsado {

    DAcessorioUsado buscar (Integer id);
    Paged<DAcessorioUsado> buscar(PageableRequest request);
}
