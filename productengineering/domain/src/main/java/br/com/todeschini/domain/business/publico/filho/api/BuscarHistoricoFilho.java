package br.com.todeschini.domain.business.publico.filho.api;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoFilho {

    List<DHistory<DFilho>> buscarHistorico(Integer id);
}
