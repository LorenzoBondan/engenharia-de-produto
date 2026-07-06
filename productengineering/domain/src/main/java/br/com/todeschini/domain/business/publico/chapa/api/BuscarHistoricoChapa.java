package br.com.todeschini.domain.business.publico.chapa.api;

import br.com.todeschini.domain.business.publico.chapa.DChapa;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoChapa {

    List<DHistory<DChapa>> buscarHistorico(Integer id);
}
