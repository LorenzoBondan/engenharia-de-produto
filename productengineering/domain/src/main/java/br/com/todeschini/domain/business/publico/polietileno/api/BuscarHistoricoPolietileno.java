package br.com.todeschini.domain.business.publico.polietileno.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

import java.util.List;

public interface BuscarHistoricoPolietileno {

    List<DHistory<DPolietileno>> buscarHistorico(Integer id);
}
