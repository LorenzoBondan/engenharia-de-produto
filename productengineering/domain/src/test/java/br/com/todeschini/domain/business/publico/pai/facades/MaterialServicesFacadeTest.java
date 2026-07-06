package br.com.todeschini.domain.business.publico.pai.facades;

import br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory;
import br.com.todeschini.domain.business.publico.material.api.MaterialService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MaterialServicesFacadeTest {

    private MaterialService materialService;
    private MaterialProcessadorFactory materialProcessadorFactory;
    private MaterialServicesFacade facade;

    @BeforeEach
    void setup() {
        materialService = mock(MaterialService.class);
        materialProcessadorFactory = mock(MaterialProcessadorFactory.class);
        facade = new MaterialServicesFacade(materialService, materialProcessadorFactory);
    }

    @Test
    void deveRetornarMaterialService() {
        assertNotNull(facade.getMaterialService());
        assertEquals(materialService, facade.getMaterialService());
    }

    @Test
    void deveRetornarMaterialProcessadorFactory() {
        assertNotNull(facade.getMaterialProcessadorFactory());
        assertEquals(materialProcessadorFactory, facade.getMaterialProcessadorFactory());
    }

    @Test
    void deveManterReferenciasOriginais() {
        MaterialService service1 = facade.getMaterialService();
        MaterialService service2 = facade.getMaterialService();

        assertSame(service1, service2);
    }
}
