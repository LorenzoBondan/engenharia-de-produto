package br.com.todeschini.domain.business.publico.pintura.api;

import br.com.todeschini.domain.business.publico.pintura.DPintura;

public interface SubstituirPinturaPorVersaoAntiga {

    DPintura substituirPorVersaoAntiga(Integer id, Integer versionId);
}
