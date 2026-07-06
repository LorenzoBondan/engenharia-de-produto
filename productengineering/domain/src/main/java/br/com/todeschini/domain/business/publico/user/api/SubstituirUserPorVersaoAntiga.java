package br.com.todeschini.domain.business.publico.user.api;

import br.com.todeschini.domain.business.publico.user.DUser;

public interface SubstituirUserPorVersaoAntiga {

    DUser substituirPorVersaoAntiga(Integer id, Integer versionId);
}
