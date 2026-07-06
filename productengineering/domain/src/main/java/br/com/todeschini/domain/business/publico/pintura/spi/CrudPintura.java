package br.com.todeschini.domain.business.publico.pintura.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.pintura.DPintura;
import br.com.todeschini.domain.business.publico.plastico.DPlastico;

import java.util.Collection;

public interface CrudPintura extends SimpleCrud<DPintura, Integer> {

    Collection<DPintura> pesquisarPorTipoPinturaECor (Integer tipopintura, Integer cdcor);
}
