package br.com.todeschini.domain.business.publico.medidas.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;

import java.util.Collection;

public interface CrudMedidas extends SimpleCrud<DMedidas, Integer> {

    Collection<DMedidas> pesquisarPorAlturaELarguraEEspessura (Integer altura, Integer largura, Integer espessura);
}
