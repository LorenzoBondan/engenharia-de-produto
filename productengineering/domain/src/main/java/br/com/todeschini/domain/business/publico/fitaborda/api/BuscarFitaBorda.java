package br.com.todeschini.domain.business.publico.fitaborda.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;

public interface BuscarFitaBorda {

    DFitaBorda buscar (Integer id);
    Paged<DFitaBorda> buscar(PageableRequest request);
}
