package br.com.todeschini.domain.business.publico.roteiro.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

import java.util.List;

public interface BuscarHistoricoRoteiro {

    List<DHistory<DRoteiro>> buscarHistorico(Integer id);
}
