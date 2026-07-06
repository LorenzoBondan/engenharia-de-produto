package br.com.todeschini.domain.business.publico.baguete.api;

import br.com.todeschini.domain.business.publico.baguete.DBaguete;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoBaguete {

    List<DHistory<DBaguete>> buscarHistorico(Integer id);
}
