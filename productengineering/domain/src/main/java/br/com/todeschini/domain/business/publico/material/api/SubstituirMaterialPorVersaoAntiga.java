package br.com.todeschini.domain.business.publico.material.api;

import br.com.todeschini.domain.business.publico.material.DMaterial;

public interface SubstituirMaterialPorVersaoAntiga {

    DMaterial substituirPorVersaoAntiga(Integer id, Integer versionId);
}
