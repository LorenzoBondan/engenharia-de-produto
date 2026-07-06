package br.com.todeschini.domain.business.publico.pai.api;

import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai;
import br.com.todeschini.domain.business.publico.pai.DPai;

public interface MontarEstruturaPai {

    DPai montarEstrutura (DMontadorEstruturaPai montadorEstruturaPai);
}
