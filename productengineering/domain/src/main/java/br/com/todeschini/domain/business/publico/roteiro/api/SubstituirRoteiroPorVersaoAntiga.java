package br.com.todeschini.domain.business.publico.roteiro.api;

import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;

public interface SubstituirRoteiroPorVersaoAntiga {

    DRoteiro substituirPorVersaoAntiga(Integer id, Integer versionId);
}
