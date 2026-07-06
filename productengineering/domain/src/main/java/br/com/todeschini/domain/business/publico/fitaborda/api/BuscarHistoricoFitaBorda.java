package br.com.todeschini.domain.business.publico.fitaborda.api;

import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoFitaBorda {

    List<DHistory<DFitaBorda>> buscarHistorico(Integer id);
}
