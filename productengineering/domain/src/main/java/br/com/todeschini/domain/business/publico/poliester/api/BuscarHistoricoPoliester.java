package br.com.todeschini.domain.business.publico.poliester.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.poliester.DPoliester;

import java.util.List;

public interface BuscarHistoricoPoliester {

    List<DHistory<DPoliester>> buscarHistorico(Integer id);
}
