package br.com.todeschini.domain.business.publico.plastico.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;

import java.util.List;

public interface BuscarHistoricoPlastico {

    List<DHistory<DPlastico>> buscarHistorico(Integer id);
}
