package br.com.todeschini.domain.business.publico.medidas.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;

import java.util.List;

public interface BuscarHistoricoMedidas {

    List<DHistory<DMedidas>> buscarHistorico(Integer id);
}
