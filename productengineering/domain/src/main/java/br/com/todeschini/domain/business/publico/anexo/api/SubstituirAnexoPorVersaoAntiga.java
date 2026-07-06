package br.com.todeschini.domain.business.publico.anexo.api;

import br.com.todeschini.domain.business.publico.anexo.DAnexo;

public interface SubstituirAnexoPorVersaoAntiga {

    DAnexo substituirPorVersaoAntiga(Integer id, Integer versionId);
}
