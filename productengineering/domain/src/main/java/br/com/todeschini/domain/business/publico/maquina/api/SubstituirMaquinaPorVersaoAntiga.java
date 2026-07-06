package br.com.todeschini.domain.business.publico.maquina.api;

import br.com.todeschini.domain.business.publico.maquina.DMaquina;

public interface SubstituirMaquinaPorVersaoAntiga {

    DMaquina substituirPorVersaoAntiga(Integer id, Integer versionId);
}
