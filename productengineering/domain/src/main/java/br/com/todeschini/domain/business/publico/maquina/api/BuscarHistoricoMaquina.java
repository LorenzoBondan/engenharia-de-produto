package br.com.todeschini.domain.business.publico.maquina.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;

import java.util.List;

public interface BuscarHistoricoMaquina {

    List<DHistory<DMaquina>> buscarHistorico(Integer id);
}
