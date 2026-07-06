package br.com.todeschini.domain.business.publico.acessorio.api;

import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;

public interface SubstituirAcessorioPorVersaoAntiga {

    DAcessorio substituirPorVersaoAntiga(Integer id, Integer versionId);
}
