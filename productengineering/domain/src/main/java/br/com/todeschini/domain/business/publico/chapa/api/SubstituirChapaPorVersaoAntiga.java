package br.com.todeschini.domain.business.publico.chapa.api;

import br.com.todeschini.domain.business.publico.chapa.DChapa;

public interface SubstituirChapaPorVersaoAntiga {

    DChapa substituirPorVersaoAntiga(Integer id, Integer versionId);
}
