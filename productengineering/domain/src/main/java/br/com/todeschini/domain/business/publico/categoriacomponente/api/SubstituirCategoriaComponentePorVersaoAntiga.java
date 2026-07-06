package br.com.todeschini.domain.business.publico.categoriacomponente.api;

import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;

public interface SubstituirCategoriaComponentePorVersaoAntiga {

    DCategoriaComponente substituirPorVersaoAntiga(Integer id, Integer versionId);
}
