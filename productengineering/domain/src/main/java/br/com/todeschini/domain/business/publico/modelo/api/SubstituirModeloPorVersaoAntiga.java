package br.com.todeschini.domain.business.publico.modelo.api;

import br.com.todeschini.domain.business.publico.modelo.DModelo;

public interface SubstituirModeloPorVersaoAntiga {

    DModelo substituirPorVersaoAntiga(Integer id, Integer versionId);
}
