package br.com.todeschini.domain.business.publico.modelo.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.modelo.DModelo;

import java.util.List;

public interface BuscarHistoricoModelo {

    List<DHistory<DModelo>> buscarHistorico(Integer id);
}
