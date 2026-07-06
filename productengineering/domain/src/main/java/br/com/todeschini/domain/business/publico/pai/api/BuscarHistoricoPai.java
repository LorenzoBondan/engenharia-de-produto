package br.com.todeschini.domain.business.publico.pai.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pai.DPai;

import java.util.List;

public interface BuscarHistoricoPai {

    List<DHistory<DPai>> buscarHistorico(Integer id);
}
