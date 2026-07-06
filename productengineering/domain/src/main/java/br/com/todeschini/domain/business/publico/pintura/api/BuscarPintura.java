package br.com.todeschini.domain.business.publico.pintura.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.pintura.DPintura;

public interface BuscarPintura {

    DPintura buscar (Integer id);
    Paged<DPintura> buscar(PageableRequest request);
}
