package br.com.todeschini.domain.business.publico.pintura.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pintura.DPintura;

import java.util.List;

public interface BuscarHistoricoPintura {

    List<DHistory<DPintura>> buscarHistorico(Integer id);
}
