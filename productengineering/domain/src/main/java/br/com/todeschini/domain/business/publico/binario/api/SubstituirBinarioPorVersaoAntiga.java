package br.com.todeschini.domain.business.publico.binario.api;

import br.com.todeschini.domain.business.publico.binario.DBinario;

public interface SubstituirBinarioPorVersaoAntiga {

    DBinario substituirPorVersaoAntiga(Integer id, Integer versionId);
}
