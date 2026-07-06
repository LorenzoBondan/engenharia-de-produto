package br.com.todeschini.domain.business.publico.user.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.user.DUser;

import java.util.List;

public interface BuscarHistoricoUser {

    List<DHistory<DUser>> buscarHistorico(Integer id);
}
