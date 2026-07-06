package br.com.todeschini.domain.business.publico.cantoneira.api;

import br.com.todeschini.domain.business.publico.cantoneira.DCantoneira;

public interface SubstituirCantoneiraPorVersaoAntiga {

    DCantoneira substituirPorVersaoAntiga(Integer id, Integer versionId);
}
