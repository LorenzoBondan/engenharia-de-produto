package br.com.todeschini.domain.business.publico.tnt.api;

import br.com.todeschini.domain.business.publico.tnt.DTnt;

public interface SubstituirTntPorVersaoAntiga {

    DTnt substituirPorVersaoAntiga(Integer id, Integer versionId);
}
