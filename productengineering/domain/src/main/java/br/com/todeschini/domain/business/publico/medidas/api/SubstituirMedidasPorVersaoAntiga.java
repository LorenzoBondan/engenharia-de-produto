package br.com.todeschini.domain.business.publico.medidas.api;

import br.com.todeschini.domain.business.publico.medidas.DMedidas;

public interface SubstituirMedidasPorVersaoAntiga {

    DMedidas substituirPorVersaoAntiga(Integer id, Integer versionId);
}
