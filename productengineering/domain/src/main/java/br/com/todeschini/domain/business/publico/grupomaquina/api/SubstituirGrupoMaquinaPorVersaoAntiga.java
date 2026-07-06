package br.com.todeschini.domain.business.publico.grupomaquina.api;

import br.com.todeschini.domain.business.publico.grupomaquina.DGrupoMaquina;

public interface SubstituirGrupoMaquinaPorVersaoAntiga {

    DGrupoMaquina substituirPorVersaoAntiga(Integer id, Integer versionId);
}
