package br.com.todeschini.domain.business.processadores;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.material.DMaterial;

public interface MaterialProcessador {

    void processarMaterial(DFilho filho, DMaterial material);
}
