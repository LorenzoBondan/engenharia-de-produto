package br.com.todeschini.domain.business.publico.cola.api;

import br.com.todeschini.domain.business.publico.cola.DCola;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoCola {

    List<DHistory<DCola>> buscarHistorico(Integer id);
}
