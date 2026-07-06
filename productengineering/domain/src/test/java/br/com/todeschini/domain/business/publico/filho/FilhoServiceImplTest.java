package br.com.todeschini.domain.business.publico.filho;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.cor.DCor;
import br.com.todeschini.domain.business.publico.filho.spi.CrudFilho;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.medidas.DMedidas;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.util.tests.FilhoFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FilhoServiceImplTest {

    private CrudFilho crud;
    private ConversaoValores conversaoValores;
    private FilhoServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudFilho.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new FilhoServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DFilho> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DFilho> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DFilho domain = FilhoFactory.createDFilho();
        when(crud.buscar(1)).thenReturn(domain);

        DFilho result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DFilho domain = FilhoFactory.createDFilho();

        when(crud.pesquisarPorDescricaoEMedidas(domain.getDescricao(), domain.getMedidas().getCodigo())).thenReturn(List.of());
        when(crud.pesquisarPorDescricaoECorEMedidas(domain.getDescricao(), domain.getCor().getCodigo(), domain.getMedidas().getCodigo())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DFilho result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DFilho domain = FilhoFactory.createDuplicatedDFilho("Duplicado", 1);
        when(crud.pesquisarPorDescricaoECorEMedidas("Duplicado", 1, 1))
                .thenReturn(List.of(new DFilho(1, "Duplicado", null,new DCor(1) ,new DMedidas(1),null,null, null, null, null, DSituacaoEnum.ATIVO, null, null, null)));

        assertThrows(UniqueConstraintViolationException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DFilho domain = FilhoFactory.createDFilho();

        when(crud.pesquisarPorDescricaoEMedidas(domain.getDescricao(), domain.getMedidas().getCodigo())).thenReturn(List.of());
        when(crud.pesquisarPorDescricaoECorEMedidas(domain.getDescricao(), domain.getCor().getCodigo(), domain.getMedidas().getCodigo())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DFilho result = service.atualizar(domain);

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
        List<String> atributos = List.of("valor");
        List<Object> valores = List.of(10.0);

        DFilho domain1 = FilhoFactory.createDFilho();
        DFilho domain2 = FilhoFactory.createDFilho();
        domain2.setCodigo(2);

        Field updatedField = DFilho.class.getDeclaredField("valor");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DFilho.class), eq("valor"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DFilho> atualizados = service.atualizarEmLote(codigos, atributos, valores);

        assertNotNull(atualizados);
        assertEquals(2, atualizados.size());
        assertEquals(10.0, atualizados.get(0).getValor());
        assertEquals(10.0, atualizados.get(1).getValor());

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

        DFilho versaoAntiga = new DFilho(versionId, "Versão Antiga", null, null, null, null, null, null, null, null, null, null, null, null);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DFilho substituido = service.substituirPorVersaoAntiga(id, versionId);

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
        List<DHistory<DFilho>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DFilho>> result = service.buscarHistorico(1);

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
}
