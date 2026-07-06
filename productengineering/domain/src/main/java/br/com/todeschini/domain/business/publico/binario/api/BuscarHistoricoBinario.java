package br.com.todeschini.domain.business.publico.binario.api;

import br.com.todeschini.domain.business.publico.binario.DBinario;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoBinario {

    List<DHistory<DBinario>> buscarHistorico(Integer id);
}
