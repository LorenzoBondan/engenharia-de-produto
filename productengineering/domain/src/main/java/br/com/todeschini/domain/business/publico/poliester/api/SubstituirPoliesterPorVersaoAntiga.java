package br.com.todeschini.domain.business.publico.poliester.api;

import br.com.todeschini.domain.business.publico.poliester.DPoliester;

public interface SubstituirPoliesterPorVersaoAntiga {

    DPoliester substituirPorVersaoAntiga(Integer id, Integer versionId);
}
