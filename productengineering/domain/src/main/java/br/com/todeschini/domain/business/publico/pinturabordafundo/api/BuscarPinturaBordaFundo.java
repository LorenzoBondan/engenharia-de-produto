package br.com.todeschini.domain.business.publico.pinturabordafundo.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

public interface BuscarPinturaBordaFundo {

    DPinturaBordaFundo buscar (Integer id);
    Paged<DPinturaBordaFundo> buscar(PageableRequest request);
}
