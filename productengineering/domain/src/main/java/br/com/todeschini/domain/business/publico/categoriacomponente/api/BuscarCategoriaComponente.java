package br.com.todeschini.domain.business.publico.categoriacomponente.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;

public interface BuscarCategoriaComponente {

    DCategoriaComponente buscar (Integer id);
    Paged<DCategoriaComponente> buscar(PageableRequest request);
}
