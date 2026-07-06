package br.com.todeschini.domain.business.publico.cola.api;

import br.com.todeschini.domain.business.publico.cola.DCola;

public interface SubstituirColaPorVersaoAntiga {

    DCola substituirPorVersaoAntiga(Integer id, Integer versionId);
}
