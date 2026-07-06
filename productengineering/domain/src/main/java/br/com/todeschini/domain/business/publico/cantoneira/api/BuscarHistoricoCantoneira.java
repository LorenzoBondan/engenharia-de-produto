package br.com.todeschini.domain.business.publico.cantoneira.api;

import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoCantoneira {

    List<DHistory<DCantoneira>> buscarHistorico(Integer id);
}
