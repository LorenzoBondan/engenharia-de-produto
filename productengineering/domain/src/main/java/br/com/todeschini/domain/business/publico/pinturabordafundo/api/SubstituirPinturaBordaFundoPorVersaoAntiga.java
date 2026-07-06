package br.com.todeschini.domain.business.publico.pinturabordafundo.api;

import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

public interface SubstituirPinturaBordaFundoPorVersaoAntiga {

    DPinturaBordaFundo substituirPorVersaoAntiga(Integer id, Integer versionId);
}
