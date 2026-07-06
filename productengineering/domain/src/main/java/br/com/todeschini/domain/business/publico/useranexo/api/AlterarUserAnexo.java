package br.com.todeschini.domain.business.publico.useranexo.api;

import br.com.todeschini.domain.business.publico.useranexo.DUserAnexo;
import br.com.todeschini.domain.business.publico.useranexo.DUserAnexoPersist;

public interface AlterarUserAnexo {

    DUserAnexo atualizar (DUserAnexoPersist userAnexo);
}
