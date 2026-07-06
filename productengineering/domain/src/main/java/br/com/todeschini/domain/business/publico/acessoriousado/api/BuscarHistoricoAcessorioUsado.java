package br.com.todeschini.domain.business.publico.acessoriousado.api;

import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;
import br.com.todeschini.domain.business.publico.history.DHistory;

import java.util.List;

public interface BuscarHistoricoAcessorioUsado {

    List<DHistory<DAcessorioUsado>> buscarHistorico(Integer id);
}
