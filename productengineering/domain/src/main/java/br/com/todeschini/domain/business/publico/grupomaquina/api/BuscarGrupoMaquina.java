package br.com.todeschini.domain.business.publico.grupomaquina.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;

public interface BuscarGrupoMaquina {

    DGrupoMaquina buscar (Integer id);
    Paged<DGrupoMaquina> buscar(PageableRequest request);
}
