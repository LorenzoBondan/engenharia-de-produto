package br.com.todeschini.domain.business.publico.materialusado.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;

import java.util.Collection;

public interface CrudMaterialUsado extends SimpleCrud<DMaterialUsado, Integer> {

    Collection<DMaterialUsado> pesquisarPorFilhoEMaterial (Integer cdfilho, Integer cdmaterial);
}
