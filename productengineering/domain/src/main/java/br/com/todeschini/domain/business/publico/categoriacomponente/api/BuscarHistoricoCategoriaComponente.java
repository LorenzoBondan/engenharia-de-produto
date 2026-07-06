package br.com.todeschini.domain.business.publico.categoriacomponente.api;

import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoCategoriaComponente {

    List<DHistory<DCategoriaComponente>> buscarHistorico(Integer id);
}
