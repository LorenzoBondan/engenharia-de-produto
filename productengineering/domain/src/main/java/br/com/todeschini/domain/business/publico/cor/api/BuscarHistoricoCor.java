package br.com.todeschini.domain.business.publico.cor.api;

import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoCor {

    List<DHistory<DCor>> buscarHistorico(Integer id);
}
