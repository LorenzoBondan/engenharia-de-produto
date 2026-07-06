package br.com.todeschini.domain.business.publico.fitaborda.api;

import br.com.todeschini.domain.business.publico.fitaborda.DFitaBorda;

public interface SubstituirFitaBordaPorVersaoAntiga {

    DFitaBorda substituirPorVersaoAntiga(Integer id, Integer versionId);
}
