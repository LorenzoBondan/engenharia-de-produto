package br.com.todeschini.domain.business.publico.grupomaquina.api;

import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoGrupoMaquina {

    List<DHistory<DGrupoMaquina>> buscarHistorico(Integer id);
}
