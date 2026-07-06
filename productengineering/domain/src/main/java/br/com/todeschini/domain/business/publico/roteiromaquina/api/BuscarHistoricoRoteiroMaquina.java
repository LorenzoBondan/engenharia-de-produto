package br.com.todeschini.domain.business.publico.roteiromaquina.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

import java.util.List;

public interface BuscarHistoricoRoteiroMaquina {

    List<DHistory<DRoteiroMaquina>> buscarHistorico(Integer id);
}
