package br.com.todeschini.domain.business.publico.useranexo.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;

import java.util.List;

public interface BuscarHistoricoUserAnexo {

    List<DHistory<DUserAnexo>> buscarHistorico(Integer id);
}
