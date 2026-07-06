package br.com.todeschini.domain.business.publico.filho.api;

import br.com.todeschini.domain.business.publico.filho.DFilho;

public interface SubstituirFilhoPorVersaoAntiga {

    DFilho substituirPorVersaoAntiga(Integer id, Integer versionId);
}
