package br.com.todeschini.domain.business.publico.materialusado.api;

import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;

import java.util.List;

public interface BuscarHistoricoMaterialUsado {

    List<DHistory<DMaterialUsado>> buscarHistorico(Integer id);
}
