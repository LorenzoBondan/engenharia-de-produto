package br.com.todeschini.domain.business.publico.roteiromaquina.api;

import br.com.todeschini.domain.business.publico.roteiromaquina.DRoteiroMaquina;

public interface SubstituirRoteiroMaquinaPorVersaoAntiga {

    DRoteiroMaquina substituirPorVersaoAntiga(Integer id, Integer versionId);
}
