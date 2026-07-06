package br.com.todeschini.domain.business.publico.baguete.api;

import br.com.todeschini.domain.business.publico.baguete.DBaguete;

public interface SubstituirBaguetePorVersaoAntiga {

    DBaguete substituirPorVersaoAntiga(Integer id, Integer versionId);
}
