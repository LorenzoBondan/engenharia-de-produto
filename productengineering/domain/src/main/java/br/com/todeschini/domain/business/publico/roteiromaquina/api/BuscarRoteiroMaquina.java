package br.com.todeschini.domain.business.publico.roteiromaquina.api;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

public interface BuscarRoteiroMaquina {

    DRoteiroMaquina buscar (Integer id);
    Paged<DRoteiroMaquina> buscar(PageableRequest request);
}
