package br.com.todeschini.domain.business.publico.anexo.api;

import br.com.todeschini.domain.business.publico.anexo.DAnexo;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoAnexo {

    List<DHistory<DAnexo>> buscarHistorico(Integer id);
}
