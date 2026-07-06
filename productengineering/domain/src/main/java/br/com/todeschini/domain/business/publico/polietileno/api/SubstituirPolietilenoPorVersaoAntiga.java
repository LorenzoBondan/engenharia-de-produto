package br.com.todeschini.domain.business.publico.polietileno.api;

import br.com.todeschini.domain.business.publico.polietileno.DPolietileno;

public interface SubstituirPolietilenoPorVersaoAntiga {

    DPolietileno substituirPorVersaoAntiga(Integer id, Integer versionId);
}
