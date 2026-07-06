package br.com.todeschini.domain.business.publico.pai.builders;

import br.com.todeschini.domain.business.enums.DTipoFilhoEnum;
import br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.business.publico.modelo.DModelo;
import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.business.publico.pai.facades.EstruturaServicesFacade;
import br.com.todeschini.domain.business.publico.pai.facades.MaterialServicesFacade;
import br.com.todeschini.domain.business.publico.pai.helpers.FilhoFactory;
import br.com.todeschini.domain.business.publico.pai.helpers.MedidasValidator;
import br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai;
import br.com.todeschini.domain.business.publico.pai.spi.CrudPai;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EstruturaPaiProcessorTest {

    private CrudPai crudPai;
    private EstruturaServicesFacade estruturaFacade;
    private MaterialServicesFacade materialFacade;
    private MedidasValidator medidasValidator;
    private FilhoFactory filhoFactory;
    private EstruturaPaiProcessor processor;

    @BeforeEach
    void setup() {
        crudPai = mock(CrudPai.class);
        estruturaFacade = mock(EstruturaServicesFacade.class);
        materialFacade = mock(MaterialServicesFacade.class);
        medidasValidator = mock(MedidasValidator.class);
        filhoFactory = mock(FilhoFactory.class);
        processor = new EstruturaPaiProcessor(crudPai, estruturaFacade, materialFacade, medidasValidator, filhoFactory);
    }

    @Test
    void deveMontarPaiComAtributosCorretos() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);
        modelo.setDescricao("Modelo Teste");

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);
        categoria.setDescricao("Categoria Teste");

        DMontadorEstruturaPai montador = DMontadorEstruturaPai.builder()
                .modelo(modelo)
                .categoriaComponente(categoria)
                .bordasComprimento(2)
                .bordasLargura(2)
                .numeroCantoneiras(4)
                .tntUmaFace(true)
                .plasticoAcima(true)
                .plasticoAdicional(100.0)
                .larguraPlastico(100)
                .build();

        when(estruturaFacade.getModeloService()).thenReturn(mock(br.com.todeschini.domain.business.publico.modelo.api.ModeloService.class));
        when(estruturaFacade.getModeloService().buscar(1)).thenReturn(modelo);
        when(estruturaFacade.getCategoriaComponenteService()).thenReturn(mock(br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService.class));
        when(estruturaFacade.getCategoriaComponenteService().buscar(1)).thenReturn(categoria);

        DPai pai = processor.montarPai(montador);

        assertNotNull(pai);
        assertEquals(modelo, pai.getModelo());
        assertEquals(categoria, pai.getCategoriaComponente());
        assertEquals(2, pai.getBordasComprimento());
        assertEquals(2, pai.getBordasLargura());
        assertEquals(4, pai.getNumeroCantoneiras());
        assertTrue(pai.getTntUmaFace());
        assertTrue(pai.getPlasticoAcima());
        assertEquals(100.0, pai.getPlasticoAdicional());
        assertEquals(100, pai.getLarguraPlastico());
        assertNotNull(pai.getFilhos());
    }

    @Test
    void deveIncluirPai() {
        DPai pai = new DPai();
        pai.setDescricao("Pai Teste");

        DPai paiInserido = new DPai();
        paiInserido.setCodigo(1);
        paiInserido.setDescricao("Pai Teste");

        when(crudPai.inserir(pai)).thenReturn(paiInserido);

        DPai resultado = processor.incluirPai(pai);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        verify(crudPai, times(1)).inserir(pai);
    }

    @Test
    void deveAtualizarPai() {
        DPai pai = new DPai();
        pai.setCodigo(1);
        pai.setDescricao("Pai Atualizado");

        when(crudPai.atualizar(pai)).thenReturn(pai);

        DPai resultado = processor.atualizarPai(pai);

        assertNotNull(resultado);
        assertEquals("Pai Atualizado", resultado.getDescricao());
        verify(crudPai, times(1)).atualizar(pai);
    }

    @Test
    void deveMontarEstruturaCompleta() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);
        modelo.setDescricao("Modelo Teste");

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);
        categoria.setDescricao("Categoria Teste");

        DMedidas medida = new DMedidas();
        medida.setCodigo(1);
        medida.setAltura(100);
        medida.setLargura(50);
        medida.setEspessura(15);

        DCor cor = new DCor();
        cor.setCodigo(1);
        cor.setDescricao("Branco");

        DMontadorEstruturaPai montador = DMontadorEstruturaPai.builder()
                .modelo(modelo)
                .categoriaComponente(categoria)
                .cores(List.of(cor))
                .medidas(new ArrayList<>(List.of(medida)))
                .implantacao(LocalDate.now())
                .tipoFilho(DTipoFilhoEnum.MDP)
                .bordasComprimento(2)
                .bordasLargura(2)
                .numeroCantoneiras(4)
                .tntUmaFace(true)
                .plasticoAcima(true)
                .plasticoAdicional(100.0)
                .larguraPlastico(100)
                .build();

        DPai paiInserido = new DPai();
        paiInserido.setCodigo(1);
        paiInserido.setDescricao("Categoria Teste Modelo Teste");
        paiInserido.setFilhos(new ArrayList<>());

        DFilho filho = new DFilho();
        filho.setCodigo(1);
        filho.setDescricao("Filho Teste");
        filho.setTipo(DTipoFilhoEnum.MDP);

        when(estruturaFacade.getModeloService()).thenReturn(mock(br.com.todeschini.domain.business.publico.modelo.api.ModeloService.class));
        when(estruturaFacade.getModeloService().buscar(1)).thenReturn(modelo);
        when(estruturaFacade.getCategoriaComponenteService()).thenReturn(mock(br.com.todeschini.domain.business.publico.categoriacomponente.api.CategoriaComponenteService.class));
        when(estruturaFacade.getCategoriaComponenteService().buscar(1)).thenReturn(categoria);
        when(crudPai.inserir(any(DPai.class))).thenReturn(paiInserido);
        when(medidasValidator.verificarOuIncluir(medida)).thenReturn(medida);
        when(filhoFactory.criarFilho(any(), any(), any(), any(), any(), any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService()).thenReturn(mock(br.com.todeschini.domain.business.publico.filho.api.FilhoService.class));
        when(estruturaFacade.getFilhoService().incluir(any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService().atualizar(any())).thenReturn(filho);
        when(crudPai.atualizar(any(DPai.class))).thenReturn(paiInserido);

        // Mock MaterialProcessadorFactory
        br.com.todeschini.domain.business.processadores.MaterialProcessador processador =
                mock(br.com.todeschini.domain.business.processadores.MaterialProcessador.class);
        when(materialFacade.getMaterialProcessadorFactory()).thenReturn(mock(br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory.class));
        when(materialFacade.getMaterialProcessadorFactory().getProcessador(anyString())).thenReturn(processador);
        doNothing().when(processador).processarMaterial(any(), any());

        DPai resultado = processor.montarEstrutura(montador);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        verify(crudPai, times(1)).inserir(any(DPai.class));
        verify(crudPai, times(1)).atualizar(any(DPai.class));
        verify(medidasValidator, times(1)).verificarOuIncluir(medida);
        verify(filhoFactory, times(1)).criarFilho(any(), any(), any(), any(), any(), any());
    }

    @Test
    void deveProcessarMedidasEFilhosCorretamente() {
        DModelo modelo = new DModelo();
        modelo.setCodigo(1);

        DCategoriaComponente categoria = new DCategoriaComponente();
        categoria.setCodigo(1);

        DMedidas medida1 = new DMedidas();
        medida1.setCodigo(1);

        DMedidas medida2 = new DMedidas();
        medida2.setCodigo(2);

        DCor cor1 = new DCor();
        cor1.setCodigo(1);

        DCor cor2 = new DCor();
        cor2.setCodigo(2);

        DMontadorEstruturaPai montador = DMontadorEstruturaPai.builder()
                .modelo(modelo)
                .categoriaComponente(categoria)
                .cores(List.of(cor1, cor2))
                .medidas(new ArrayList<>(List.of(medida1, medida2)))
                .implantacao(LocalDate.now())
                .tipoFilho(DTipoFilhoEnum.MDP)
                .build();

        DPai pai = new DPai();
        pai.setCodigo(1);
        pai.setDescricao("Pai Teste");
        pai.setFilhos(new ArrayList<>());

        DFilho filho = new DFilho();
        filho.setCodigo(1);
        filho.setTipo(DTipoFilhoEnum.MDP);

        when(medidasValidator.verificarOuIncluir(any())).thenReturn(medida1, medida2);
        when(filhoFactory.criarFilho(any(), any(), any(), any(), any(), any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService()).thenReturn(mock(br.com.todeschini.domain.business.publico.filho.api.FilhoService.class));
        when(estruturaFacade.getFilhoService().incluir(any())).thenReturn(filho);
        when(estruturaFacade.getFilhoService().atualizar(any())).thenReturn(filho);

        // Mock MaterialProcessadorFactory
        br.com.todeschini.domain.business.processadores.MaterialProcessador processador =
                mock(br.com.todeschini.domain.business.processadores.MaterialProcessador.class);
        when(materialFacade.getMaterialProcessadorFactory()).thenReturn(mock(br.com.todeschini.domain.business.processadores.MaterialProcessadorFactory.class));
        when(materialFacade.getMaterialProcessadorFactory().getProcessador(anyString())).thenReturn(processador);
        doNothing().when(processador).processarMaterial(any(), any());

        processor.processarMedidasEFilhos(montador, pai);

        // 2 medidas * 2 cores = 4 filhos
        assertEquals(4, pai.getFilhos().size());
        verify(medidasValidator, times(2)).verificarOuIncluir(any());
        verify(filhoFactory, times(4)).criarFilho(any(), any(), any(), any(), any(), any());
    }
}
