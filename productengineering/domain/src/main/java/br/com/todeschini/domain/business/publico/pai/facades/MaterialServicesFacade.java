package br.com.todeschini.domain.business.publico.pai.facades;

import br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory;
import br.com.todeschini.domain.business.publico.material.api.MaterialService;

public class MaterialServicesFacade {

    private final MaterialService materialService;
    private final MaterialProcessadorFactory materialProcessadorFactory;

    public MaterialServicesFacade(MaterialService materialService, MaterialProcessadorFactory materialProcessadorFactory) {
        this.materialService = materialService;
        this.materialProcessadorFactory = materialProcessadorFactory;
    }

    public MaterialService getMaterialService() {
        return materialService;
    }

    public MaterialProcessadorFactory getMaterialProcessadorFactory() {
        return materialProcessadorFactory;
    }
}
