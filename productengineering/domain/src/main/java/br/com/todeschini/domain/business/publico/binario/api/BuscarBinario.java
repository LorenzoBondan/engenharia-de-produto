package br.com.todeschini.domain.business.publico.binario.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.binario.DBinario;

public interface BuscarBinario {

    DBinario buscar (Integer id);
    Paged<DBinario> buscar(PageableRequest request);
}
