package br.com.todeschini.domain.business.publico.grupomaquina;

import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.grupomaquina.spi.CrudGrupoMaquina;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.util.tests.GrupoMaquinaFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GrupoMaquinaServiceImplTest {

    private CrudGrupoMaquina crud;
    private GrupoMaquinaServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudGrupoMaquina.class);
        service = new GrupoMaquinaServiceImpl(crud);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DGrupoMaquina> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DGrupoMaquina> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DGrupoMaquina domain = GrupoMaquinaFactory.createDGrupoMaquina();
        when(crud.buscar(1)).thenReturn(domain);

        DGrupoMaquina result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DGrupoMaquina domain = GrupoMaquinaFactory.createDGrupoMaquina();

        when(crud.pesquisarPorNome(domain.getNome())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DGrupoMaquina result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DGrupoMaquina domain = GrupoMaquinaFactory.createDuplicatedDGrupoMaquina("Duplicado");
        when(crud.pesquisarPorNome("Duplicado"))
                .thenReturn(List.of(new DGrupoMaquina(1, "Duplicado", DSituacaoEnum.ATIVO)));

        assertThrows(RegistroDuplicadoException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DGrupoMaquina domain = GrupoMaquinaFactory.createDGrupoMaquina();

        when(crud.pesquisarPorNome(domain.getNome())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DGrupoMaquina result = service.atualizar(domain);

        assertNotNull(result);
        verify(crud, times(1)).atualizar(domain);
    }

    @Test
    void deveSubstituirPorVersaoAntigaComSucesso() {
        Integer id = 1;
        Integer versionId = 2;

        DGrupoMaquina versaoAntiga = new DGrupoMaquina(versionId, "Versão Antiga", null);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DGrupoMaquina substituido = service.substituirPorVersaoAntiga(id, versionId);

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
        List<DHistory<DGrupoMaquina>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DGrupoMaquina>> result = service.buscarHistorico(1);

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
