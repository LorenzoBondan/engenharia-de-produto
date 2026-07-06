package br.com.todeschini.domain.business.publico.pinturabordafundo.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

import java.util.List;

public interface BuscarHistoricoPinturaBordaFundo {

    List<DHistory<DPinturaBordaFundo>> buscarHistorico(Integer id);
}
