package br.com.todeschini.domain.business.publico.acessorio.api;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoAcessorio {

    List<DHistory<DAcessorio>> buscarHistorico(Integer id);
}
