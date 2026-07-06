package br.com.todeschini.domain.business.publico.pai;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaPaiProcessor;
import br.com.todeschini.domain.business.publico.pai.builders.EstruturaModulacaoBuilder;
import br.com.todeschini.domain.business.publico.pai.spi.CrudPai;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.util.tests.PaiFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PaiServiceImplTest {

    private CrudPai crud;
    private ConversaoValores conversaoValores;
    private EstruturaPaiProcessor estruturaPaiProcessor;
    private EstruturaModulacaoBuilder estruturaModulacaoBuilder;
    private PaiServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudPai.class);
        conversaoValores = mock(ConversaoValores.class);
        estruturaPaiProcessor = mock(EstruturaPaiProcessor.class);
        estruturaModulacaoBuilder = mock(EstruturaModulacaoBuilder.class);
        service = new PaiServiceImpl(crud, conversaoValores, estruturaPaiProcessor, estruturaModulacaoBuilder);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DPai> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DPai> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DPai domain = PaiFactory.createDPai();
        when(crud.buscar(1)).thenReturn(domain);

        DPai result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DPai domain = PaiFactory.createDPai();

        when(crud.pesquisarPorDescricao(domain.getDescricao())).thenReturn(List.of());
        when(crud.pesquisarPorDescricao(domain.getDescricao())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DPai result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DPai domain = PaiFactory.createDuplicatedDPai("Duplicado");
        DPai existente = new DPai(1, null, null, "Duplicado", null, null, null, null, null, null, null, null, null, null, null, null);
        existente.setSituacao(DSituacaoEnum.ATIVO);

        when(crud.pesquisarPorDescricao("Duplicado")).thenReturn(List.of(existente));

        assertThrows(RegistroDuplicadoException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DPai domain = PaiFactory.createDPai();

        when(crud.pesquisarPorDescricao(domain.getDescricao())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DPai result = service.atualizar(domain);

        assertNotNull(result);
        verify(crud, times(1)).atualizar(domain);
    }

    @Test
    void deveLancarExcecaoSeAtributosEValoresNaoForemIguais() {
        List<Integer> codigos = List.of(1);
        List<String> atributos = List.of("descricao");
        List<Object> valores = List.of("Novo Valor", 10);

        assertThrows(BadRequestException.class, () ->
                service.atualizarEmLote(codigos, atributos, valores)
        );
    }

    @Test
    void deveAtualizarEmLoteComSucesso() throws NoSuchFieldException {
        List<Integer> codigos = List.of(1, 2);
        List<String> atributos = List.of("plasticoAdicional");
        List<Object> valores = List.of(10.0);

        DPai domain1 = PaiFactory.createDPai();
        DPai domain2 = PaiFactory.createDPai();
        domain2.setCodigo(2);

        Field updatedField = DPai.class.getDeclaredField("plasticoAdicional");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DPai.class), eq("plasticoAdicional"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DPai> atualizados = service.atualizarEmLote(codigos, atributos, valores);

        assertNotNull(atualizados);
        assertEquals(2, atualizados.size());
        assertEquals(10.0, atualizados.get(0).getPlasticoAdicional());
        assertEquals(10.0, atualizados.get(1).getPlasticoAdicional());

        verify(crud, times(1)).atualizarEmLote(anyList());
    }

    @Test
    void deveLancarExcecaoQuandoTamanhosNaoForemIguais() {
        List<Integer> codigos = List.of(1, 2);
        List<String> atributos = List.of("descricao");
        List<Object> valores = List.of();

        assertThrows(BadRequestException.class, () -> service.atualizarEmLote(codigos, atributos, valores));
    }

    @Test
    void deveSubstituirPorVersaoAntigaComSucesso() {
        Integer id = 1;
        Integer versionId = 2;

        DPai versaoAntiga = new DPai(versionId, null,null,"Versão Antiga", null, null, null, null, null, null, null, null, null, null, null, null);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DPai substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
        assertEquals("Versão Antiga", substituido.getDescricao());
        assertEquals(versionId, substituido.getCodigo());

        verify(crud, times(1)).substituirPorVersaoAntiga(id, versionId);
    }

    @Test
    void deveLancarExcecaoQuandoVersaoNaoExistir() {
        Integer id = 1;
        Integer versionId = 99;

        when(crud.substituirPorVersaoAntiga(id, versionId)).thenThrow(new ResourceNotFoundException("Versão não encontrada"));

        assertThrows(ResourceNotFoundException.class, () -> service.substituirPorVersaoAntiga(id, versionId));

        verify(crud, times(1)).substituirPorVersaoAntiga(id, versionId);
    }

    @Test
    void deveBuscarHistorico() {
        List<DHistory<DPai>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DPai>> result = service.buscarHistorico(1);

        assertNotNull(result);
        verify(crud, times(1)).buscarHistorico(1);
    }

    @Test
    void deveInativar() {
        doNothing().when(crud).inativar(1);

        service.inativar(1);

        verify(crud, times(1)).inativar(1);
    }

    @Test
    void deveExcluir() {
        doNothing().when(crud).remover(1);

        service.excluir(1);

        verify(crud, times(1)).remover(1);
    }

    @Test
    void deveMontarEstruturaComSucesso() {
        br.com.todeschini.domain.business.publico.modelo.DModelo modelo = new br.com.todeschini.domain.business.publico.modelo.DModelo();
        modelo.setCodigo(1);

        br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente categoria =
                new br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente();
        categoria.setCodigo(1);

        br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai montador =
                br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai.builder()
                .modelo(modelo)
                .categoriaComponente(categoria)
                .cores(List.of())
                .medidas(List.of())
                .implantacao(java.time.LocalDate.now())
                .tipoFilho(br.com.todeschini.domain.business.enums.DTipoFilhoEnum.MDP)
                .bordasComprimento(2)
                .bordasLargura(2)
                .numeroCantoneiras(4)
                .tntUmaFace(true)
                .plasticoAcima(true)
                .plasticoAdicional(100.0)
                .larguraPlastico(100)
                .build();

        DPai paiCriado = new DPai();
        paiCriado.setCodigo(null);
        paiCriado.setDescricao("Pai Teste");
        paiCriado.setModelo(modelo);
        paiCriado.setCategoriaComponente(categoria);

        DPai paiInserido = new DPai();
        paiInserido.setCodigo(1);
        paiInserido.setDescricao("Pai Teste");
        paiInserido.setModelo(modelo);
        paiInserido.setCategoriaComponente(categoria);

        DPai paiAtualizado = new DPai();
        paiAtualizado.setCodigo(1);
        paiAtualizado.setDescricao("Pai Teste");
        paiAtualizado.setModelo(modelo);
        paiAtualizado.setCategoriaComponente(categoria);

        when(estruturaPaiProcessor.montarPai(montador)).thenReturn(paiCriado);
        when(crud.pesquisarPorDescricao("Pai Teste")).thenReturn(List.of());
        when(crud.inserir(paiCriado)).thenReturn(paiInserido);
        doNothing().when(estruturaPaiProcessor).processarMedidasEFilhos(montador, paiInserido);
        when(crud.atualizar(paiInserido)).thenReturn(paiAtualizado);

        DPai resultado = service.montarEstrutura(montador);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        verify(estruturaPaiProcessor, times(1)).montarPai(montador);
        verify(crud, times(1)).inserir(paiCriado);
        verify(estruturaPaiProcessor, times(1)).processarMedidasEFilhos(montador, paiInserido);
        verify(crud, times(1)).atualizar(paiInserido);
    }

    @Test
    void deveMontarEstruturaModulacaoComSucesso() {
        DPai paiPrincipal = new DPai();
        paiPrincipal.setModelo(new br.com.todeschini.domain.business.publico.modelo.DModelo(1));
        paiPrincipal.setCategoriaComponente(new br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente(1));

        br.com.todeschini.domain.business.publico.medidas.DMedidas medidas =
                new br.com.todeschini.domain.business.publico.medidas.DMedidas();
        medidas.setCodigo(1);

        br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPaiModulacao montador =
                br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPaiModulacao.builder()
                .paiPrincipal(paiPrincipal)
                .medidasPaiPrincipal(medidas)
                .cores(List.of())
                .paisSecundarios(List.of())
                .implantacao(java.time.LocalDate.now())
                .build();

        DPai paiConstruido = new DPai();
        paiConstruido.setCodigo(1);
        paiConstruido.setDescricao("Pai Modulação");
        paiConstruido.setModelo(paiPrincipal.getModelo());
        paiConstruido.setCategoriaComponente(paiPrincipal.getCategoriaComponente());

        DPai paiAtualizado = new DPai();
        paiAtualizado.setCodigo(1);
        paiAtualizado.setDescricao("Pai Modulação");
        paiAtualizado.setModelo(paiPrincipal.getModelo());
        paiAtualizado.setCategoriaComponente(paiPrincipal.getCategoriaComponente());

        when(estruturaModulacaoBuilder.construir(montador)).thenReturn(paiConstruido);
        when(crud.pesquisarPorDescricao(anyString())).thenReturn(List.of());
        when(crud.atualizar(paiConstruido)).thenReturn(paiAtualizado);

        DPai resultado = service.montarEstruturaModulacao(montador);

        assertNotNull(resultado);
        assertEquals(1, resultado.getCodigo());
        verify(estruturaModulacaoBuilder, times(1)).construir(montador);
        verify(crud, times(1)).atualizar(paiConstruido);
    }

    @Test
    void deveLancarExcecaoAoMontarEstruturaComDescricaoDuplicada() {
        br.com.todeschini.domain.business.publico.modelo.DModelo modelo = new br.com.todeschini.domain.business.publico.modelo.DModelo();
        modelo.setCodigo(1);

        br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente categoria =
                new br.com.todeschini.domain.business.publico.categoriacomponente.DCategoriaComponente();
        categoria.setCodigo(1);

        br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai montador =
                br.com.todeschini.domain.business.publico.pai.montadores.DMontadorEstruturaPai.builder()
                .modelo(modelo)
                .categoriaComponente(categoria)
                .cores(List.of())
                .medidas(List.of())
                .implantacao(java.time.LocalDate.now())
                .tipoFilho(br.com.todeschini.domain.business.enums.DTipoFilhoEnum.MDP)
                .bordasComprimento(2)
                .bordasLargura(2)
                .numeroCantoneiras(4)
                .tntUmaFace(true)
                .plasticoAcima(true)
                .plasticoAdicional(100.0)
                .larguraPlastico(100)
                .build();

        DPai paiCriado = new DPai();
        paiCriado.setDescricao("Pai Duplicado");

        DPai paiExistente = new DPai();
        paiExistente.setCodigo(1);
        paiExistente.setDescricao("Pai Duplicado");
        paiExistente.setSituacao(DSituacaoEnum.ATIVO);

        when(estruturaPaiProcessor.montarPai(montador)).thenReturn(paiCriado);
        when(crud.pesquisarPorDescricao("Pai Duplicado")).thenReturn(List.of(paiExistente));

        assertThrows(RegistroDuplicadoException.class, () -> service.montarEstrutura(montador));
        verify(estruturaPaiProcessor, times(1)).montarPai(montador);
        verify(crud, never()).inserir(any());
    }
}
