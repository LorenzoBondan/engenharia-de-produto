package br.com.todeschini.domain.business.publico.binario;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.binario.spi.CrudBinario;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.util.tests.BinarioFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BinarioServiceImplTest {

    private CrudBinario crud;
    private ConversaoValores conversaoValores;
    private BinarioServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudBinario.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new BinarioServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DBinario> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DBinario> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DBinario domain = BinarioFactory.createDBinario();
        when(crud.buscar(1)).thenReturn(domain);

        DBinario result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DBinario domain = BinarioFactory.createDBinario();

        when(crud.inserir(domain)).thenReturn(domain);

        DBinario result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveAtualizar() {
        DBinario domain = BinarioFactory.createDBinario();

        when(crud.atualizar(domain)).thenReturn(domain);

        DBinario result = service.atualizar(domain);

        assertNotNull(result);
        verify(crud, times(1)).atualizar(domain);
    }

    @Test
    void deveSubstituirPorVersaoAntigaComSucesso() {
        Integer id = 1;
        Integer versionId = 2;

        DBinario versaoAntiga = new DBinario(versionId, null, null);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DBinario substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
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
        List<DHistory<DBinario>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DBinario>> result = service.buscarHistorico(1);

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
