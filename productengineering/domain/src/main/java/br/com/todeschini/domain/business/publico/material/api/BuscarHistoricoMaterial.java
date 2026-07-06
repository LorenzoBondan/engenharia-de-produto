package br.com.todeschini.domain.business.publico.material.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.material.DMaterial;

import java.util.List;

public interface BuscarHistoricoMaterial {

    List<DHistory<DMaterial>> buscarHistorico(Integer id);
}
