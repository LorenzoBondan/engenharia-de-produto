package br.com.todeschini.domain.business.publico.tnt.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.tnt.DTnt;

import java.util.List;

public interface BuscarHistoricoTnt {

    List<DHistory<DTnt>> buscarHistorico(Integer id);
}
