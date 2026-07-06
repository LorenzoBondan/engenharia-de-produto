package br.com.todeschini.domain.business.publico.pai.api;

import br.com.todeschini.domain.business.publico.pai.DPai;

public interface SubstituirPaiPorVersaoAntiga {

    DPai substituirPorVersaoAntiga(Integer id, Integer versionId);
}
