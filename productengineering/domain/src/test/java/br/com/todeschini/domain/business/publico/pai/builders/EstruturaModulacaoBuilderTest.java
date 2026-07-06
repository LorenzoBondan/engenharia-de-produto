package br.com.todeschini.domain.business.publico.pai.builders;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.modelo.DModelo;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.pai.facades.EstruturaServicesFacade;
import br.com.todeschini.domain.business.publico.pai.facades.MaterialServicesFacade;
import br.com.todeschini.domain.business.publico.pai.helpers.FilhoFactory;
import br.com.todeschini.domain.business.publico.pai.helpers.MedidasValidator;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPaiModulacao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EstruturaModulacaoBuilderTest {

    private EstruturaServicesFacade estruturaFacade;
    private MaterialServicesFacade materialFacade;
    private MedidasValidator medidasValidator;
    private FilhoFactory filhoFactory;
    private EstruturaPaiProcessor estruturaPaiProcessor;
    private EstruturaModulacaoBuilder builder;

    @BeforeEach
    void setup() {
        estruturaFacade = mock(EstruturaServicesFacade.class);
        materialFacade = mock(MaterialServicesFacade.class);
        medidasValidator = mock(MedidasValidator.class);
        filhoFactory = mock(FilhoFactory.class);
        estruturaPaiProcessor = mock(EstruturaPaiProcessor.class);
        builder = new EstruturaModulacaoBuilder(
                estruturaFacade,
                materialFacade,
                medidasValidator,
                filhoFactory,
                estruturaPaiProcessor
        );
    }

    @Test
    void deveConstruirEstruturaModulacaoSimples() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);
        modelo.setDescricao("Modelo Teste");

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);
        categoria.setDescricao("Categoria Teste");

        DPai paiPrincipal = new DPai();
        paiPrincipal.setModelo(modelo);
        paiPrincipal.setCategoriaComponente(categoria);
        paiPrincipal.setDescricao("Pai Principal");

        DMedidas medidasPrincipal = new DMedidas();
        medidasPrincipal.setCodigo(1);
        medidasPrincipal.setAltura(100);
        medidasPrincipal.setLargura(50);

        DCor cor = new DCor();
        cor.setCodigo(1);
        cor.setDescricao("Branco");

        DMontadorEstruturaPaiModulacao montador = DMontadorEstruturaPaiModulacao.builder()
                .paiPrincipal(paiPrincipal)
                .medidasPaiPrincipal(medidasPrincipal)
                .cores(new ArrayList<>(List.of(cor)))
                .paisSecundarios(new ArrayList<>())
                .implantacao(LocalDate.now())
                .build();

        DPai paiCriado = new DPai();
        paiCriado.setCodigo(1);
        paiCriado.setDescricao("Pai Principal");
        paiCriado.setModelo(modelo);
        paiCriado.setFilhos(new ArrayList<>());

        DFilho filho = new DFilho();
        filho.setCodigo(1);
        filho.setFilhos(new ArrayList<>());

        when(estruturaPaiProcessor.montarPai(any())).thenReturn(paiCriado);
        when(estruturaFacade.getModeloService()).thenReturn(mock(br.com.todeschini.domain.business.publico.modelo.api.ModeloService.class));
        when(estruturaFacade.getModeloService().buscar(1)).thenReturn(modelo);
        when(estruturaPaiProcessor.incluirPai(any())).thenReturn(paiCriado);
        when(medidasValidator.verificarOuIncluir(any())).thenReturn(medidasPrincipal);
        when(filhoFactory.criarFilho(any(), any(), any(), any(), any(), any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService()).thenReturn(mock(br.com.todeschini.domain.business.publico.filho.api.FilhoService.class));
        when(estruturaFacade.getFilhoService().incluir(any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService().atualizar(any())).thenReturn(filho);

        DPai resultado = builder.construir(montador);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        verify(estruturaPaiProcessor, times(1)).montarPai(any());
    }

    @Test
    void deveProcessarPaisSecundariosCorretamente() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);

        DPai paiPrincipal = new DPai();
        paiPrincipal.setModelo(modelo);
        paiPrincipal.setCategoriaComponente(categoria);

        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);

        DCor cor = new DCor();
        cor.setCodigo(1);

        DMontadorEstruturaPaiModulacao montador = DMontadorEstruturaPaiModulacao.builder()
                .paiPrincipal(paiPrincipal)
                .medidasPaiPrincipal(medidas)
                .cores(new ArrayList<>(List.of(cor)))
                .paisSecundarios(new ArrayList<>())
                .implantacao(LocalDate.now())
                .build();

        DPai paiCriado = new DPai();
        paiCriado.setCodigo(1);
        paiCriado.setModelo(modelo);
        paiCriado.setDescricao("Pai Principal");

        DFilho filhoPrincipal = new DFilho();
        filhoPrincipal.setCodigo(1);
        filhoPrincipal.setFilhos(new ArrayList<>());
        paiCriado.setFilhos(new ArrayList<>(List.of(filhoPrincipal)));

        when(estruturaPaiProcessor.montarPai(any())).thenReturn(paiCriado);
        when(estruturaFacade.getModeloService()).thenReturn(mock(br.com.todeschini.domain.business.publico.modelo.api.ModeloService.class));
        when(estruturaFacade.getModeloService().buscar(1)).thenReturn(modelo);
        when(estruturaPaiProcessor.incluirPai(any())).thenReturn(paiCriado);
        when(medidasValidator.verificarOuIncluir(any())).thenReturn(medidas);
        when(filhoFactory.criarFilho(any(), any(), any(), any(), any(), any())).thenReturn(filhoPrincipal);
        when(estruturaFacade.getFilhoService()).thenReturn(mock(br.com.todeschini.domain.business.publico.filho.api.FilhoService.class));
        when(estruturaFacade.getFilhoService().incluir(any())).thenReturn(filhoPrincipal);
        when(estruturaFacade.getFilhoService().atualizar(any())).thenReturn(filhoPrincipal);

        DPai resultado = builder.construir(montador);

        assertNotNull(resultado);
        assertFalse(resultado.getFilhos().isEmpty());
    }

    @Test
    void deveUsarModeloServiceParaBuscarModelo() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);

        DPai paiPrincipal = new DPai();
        paiPrincipal.setModelo(modelo);
        paiPrincipal.setCategoriaComponente(categoria);

        DMedidas medidas = new DMedidas();
        medidas.setCodigo(1);

        DCor cor = new DCor();
        cor.setCodigo(1);

        DMontadorEstruturaPaiModulacao montador = DMontadorEstruturaPaiModulacao.builder()
                .paiPrincipal(paiPrincipal)
                .medidasPaiPrincipal(medidas)
                .cores(new ArrayList<>(List.of(cor)))
                .paisSecundarios(new ArrayList<>())
                .implantacao(LocalDate.now())
                .build();

        DPai paiCriado = new DPai();
        paiCriado.setCodigo(1);
        paiCriado.setModelo(modelo);
        paiCriado.setFilhos(new ArrayList<>());

        DFilho filho = new DFilho();
        filho.setCodigo(1);
        filho.setFilhos(new ArrayList<>());

        when(estruturaPaiProcessor.montarPai(any())).thenReturn(paiCriado);
        when(estruturaFacade.getModeloService()).thenReturn(mock(br.com.todeschini.domain.business.publico.modelo.api.ModeloService.class));
        when(estruturaFacade.getModeloService().buscar(1)).thenReturn(modelo);
        when(estruturaPaiProcessor.incluirPai(any())).thenReturn(paiCriado);
        when(medidasValidator.verificarOuIncluir(any())).thenReturn(medidas);
        when(filhoFactory.criarFilho(any(), any(), any(), any(), any(), any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService()).thenReturn(mock(br.com.todeschini.domain.business.publico.filho.api.FilhoService.class));
        when(estruturaFacade.getFilhoService().incluir(any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService().atualizar(any())).thenReturn(filho);

        builder.construir(montador);

        verify(estruturaFacade.getModeloService(), atLeastOnce()).buscar(1);
    }
}
