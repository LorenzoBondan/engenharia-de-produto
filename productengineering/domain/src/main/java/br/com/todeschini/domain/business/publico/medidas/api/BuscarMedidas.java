package br.com.todeschini.domain.business.publico.medidas.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;

import java.util.Collection;

public interface BuscarMedidas {

    DMedidas buscar (Integer id);
    Collection<? extends DMedidas> buscarPorAlturaELarguraEEspessura (Integer altura, Integer largura, Integer espessura);
    Paged<DMedidas> buscar(PageableRequest request);
}
