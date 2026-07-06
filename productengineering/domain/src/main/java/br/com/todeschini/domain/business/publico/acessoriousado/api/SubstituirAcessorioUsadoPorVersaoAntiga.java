package br.com.todeschini.domain.business.publico.acessoriousado.api;

import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;

public interface SubstituirAcessorioUsadoPorVersaoAntiga {

    DAcessorioUsado substituirPorVersaoAntiga(Integer id, Integer versionId);
}
