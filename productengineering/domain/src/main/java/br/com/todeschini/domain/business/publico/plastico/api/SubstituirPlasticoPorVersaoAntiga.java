package br.com.todeschini.domain.business.publico.plastico.api;

import br.com.todeschini.domain.business.publico.plastico.DPlastico;

public interface SubstituirPlasticoPorVersaoAntiga {

    DPlastico substituirPorVersaoAntiga(Integer id, Integer versionId);
}
