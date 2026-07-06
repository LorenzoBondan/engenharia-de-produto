package br.com.todeschini.domain.business.publico.pinturabordafundo.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.pinturabordafundo.DPinturaBordaFundo;

import java.util.Collection;

public interface CrudPinturaBordaFundo extends SimpleCrud<DPinturaBordaFundo, Integer> {

    Collection<DPinturaBordaFundo> pesquisarPorDescricao (String descricao);
}
