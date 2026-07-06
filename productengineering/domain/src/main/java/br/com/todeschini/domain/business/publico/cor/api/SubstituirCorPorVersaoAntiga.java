package br.com.todeschini.domain.business.publico.cor.api;

import br.com.todeschini.domain.business.publico.cor.DCor;

public interface SubstituirCorPorVersaoAntiga {

    DCor substituirPorVersaoAntiga(Integer id, Integer versionId);
}
