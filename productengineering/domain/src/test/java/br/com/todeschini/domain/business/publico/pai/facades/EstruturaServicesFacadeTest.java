package br.com.todeschini.domain.business.publico.pai.facades;

import br.com.todeschini.domain.business.publico.acessorio.api.AcessorioService;
import br.com.todeschini.domain.business.publico.acessoriousado.api.AcessorioUsadoService;
import br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService;
import br.com.todeschini.domain.business.publico.cor.api.CorService;
import br.com.todeschini.domain.business.publico.filho.api.FilhoService;
import br.com.todeschini.domain.business.publico.maquina.api.MaquinaService;
import br.com.todeschini.domain.business.publico.medidas.api.MedidasService;
import br.com.todeschini.domain.business.publico.modelo.api.ModeloService;
import br.com.todeschini.domain.business.publico.roteiro.api.RoteiroService;
import br.com.todeschini.domain.business.publico.roteiromaquina.api.RoteiroMaquinaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EstruturaServicesFacadeTest {

    private FilhoService filhoService;
    private MedidasService medidasService;
    private RoteiroService roteiroService;
    private MaquinaService maquinaService;
    private RoteiroMaquinaService roteiroMaquinaService;
    private CorService corService;
    private AcessorioService acessorioService;
    private AcessorioUsadoService acessorioUsadoService;
    private ModeloService modeloService;
    private CategoriaComponenteService categoriaComponenteService;
    private EstruturaServicesFacade facade;

    @BeforeEach
    void setup() {
        filhoService = mock(FilhoService.class);
        medidasService = mock(MedidasService.class);
        roteiroService = mock(RoteiroService.class);
        maquinaService = mock(MaquinaService.class);
        roteiroMaquinaService = mock(RoteiroMaquinaService.class);
        corService = mock(CorService.class);
        acessorioService = mock(AcessorioService.class);
        acessorioUsadoService = mock(AcessorioUsadoService.class);
        modeloService = mock(ModeloService.class);
        categoriaComponenteService = mock(CategoriaComponenteService.class);

        facade = new EstruturaServicesFacade(
                filhoService,
                medidasService,
                roteiroService,
                maquinaService,
                roteiroMaquinaService,
                corService,
                acessorioService,
                acessorioUsadoService,
                modeloService,
                categoriaComponenteService
        );
    }

    @Test
    void deveRetornarFilhoService() {
        assertNotNull(facade.getFilhoService());
        assertEquals(filhoService, facade.getFilhoService());
    }

    @Test
    void deveRetornarMedidasService() {
        assertNotNull(facade.getMedidasService());
        assertEquals(medidasService, facade.getMedidasService());
    }

    @Test
    void deveRetornarRoteiroService() {
        assertNotNull(facade.getRoteiroService());
        assertEquals(roteiroService, facade.getRoteiroService());
    }

    @Test
    void deveRetornarMaquinaService() {
        assertNotNull(facade.getMaquinaService());
        assertEquals(maquinaService, facade.getMaquinaService());
    }

    @Test
    void deveRetornarRoteiroMaquinaService() {
        assertNotNull(facade.getRoteiroMaquinaService());
        assertEquals(roteiroMaquinaService, facade.getRoteiroMaquinaService());
    }

    @Test
    void deveRetornarCorService() {
        assertNotNull(facade.getCorService());
        assertEquals(corService, facade.getCorService());
    }

    @Test
    void deveRetornarAcessorioService() {
        assertNotNull(facade.getAcessorioService());
        assertEquals(acessorioService, facade.getAcessorioService());
    }

    @Test
    void deveRetornarAcessorioUsadoService() {
        assertNotNull(facade.getAcessorioUsadoService());
        assertEquals(acessorioUsadoService, facade.getAcessorioUsadoService());
    }

    @Test
    void deveRetornarModeloService() {
        assertNotNull(facade.getModeloService());
        assertEquals(modeloService, facade.getModeloService());
    }

    @Test
    void deveRetornarCategoriaComponenteService() {
        assertNotNull(facade.getCategoriaComponenteService());
        assertEquals(categoriaComponenteService, facade.getCategoriaComponenteService());
    }

    @Test
    void deveManterReferenciasOriginais() {
        FilhoService service1 = facade.getFilhoService();
        FilhoService service2 = facade.getFilhoService();

        assertSame(service1, service2);
    }
}
