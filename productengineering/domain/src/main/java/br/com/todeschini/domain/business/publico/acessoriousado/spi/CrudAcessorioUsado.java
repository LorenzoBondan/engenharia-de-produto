package br.com.todeschini.domain.business.publico.acessoriousado.spi;

import br.com.todeschini.domain.SimpleCrud;
import br.com.todeschini.domain.business.publico.acessoriousado.DAcessorioUsado;

import java.util.Collection;

public interface CrudAcessorioUsado extends SimpleCrud<DAcessorioUsado, Integer> {

    Collection<DAcessorioUsado> pesquisarPorAcessorioEFilho (Integer cdacessorio, Integer cdfilho);
}
