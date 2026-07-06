package br.com.todeschini.domain.business.publico.medidas;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.medidas.spi.CrudMedidas;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.util.tests.MedidasFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MedidasServiceImplTest {

    private CrudMedidas crud;
    private ConversaoValores conversaoValores;
    private MedidasServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudMedidas.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new MedidasServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DMedidas> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DMedidas> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DMedidas domain = MedidasFactory.createDMedidas();
        when(crud.buscar(1)).thenReturn(domain);

        DMedidas result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DMedidas domain = MedidasFactory.createDMedidas();

        when(crud.pesquisarPorAlturaELarguraEEspessura(domain.getAltura(), domain.getLargura(), domain.getEspessura())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DMedidas result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DMedidas domain = MedidasFactory.createDuplicatedDMedidas(1);
        DMedidas existente = new DMedidas(1);
        existente.setSituacao(DSituacaoEnum.ATIVO);
        when(crud.pesquisarPorAlturaELarguraEEspessura(1,1,1))
                .thenReturn(List.of(existente));

        assertThrows(UniqueConstraintViolationException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DMedidas domain = MedidasFactory.createDMedidas();

        when(crud.pesquisarPorAlturaELarguraEEspessura(domain.getAltura(), domain.getLargura(), domain.getEspessura())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DMedidas result = service.atualizar(domain);

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
        List<String> atributos = List.of("altura");
        List<Object> valores = List.of(10);

        DMedidas domain1 = MedidasFactory.createDMedidas();
        DMedidas domain2 = MedidasFactory.createDMedidas();
        domain2.setCodigo(2);

        Field updatedField = DMedidas.class.getDeclaredField("altura");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DMedidas.class), eq("altura"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Integer.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DMedidas> atualizados = service.atualizarEmLote(codigos, atributos, valores);

        assertNotNull(atualizados);
        assertEquals(2, atualizados.size());
        assertEquals(10, atualizados.get(0).getAltura());
        assertEquals(10, atualizados.get(1).getAltura());

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

        DMedidas versaoAntiga = new DMedidas(versionId);
        versaoAntiga.setAltura(2);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DMedidas substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
        assertEquals(2, substituido.getAltura());
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
        List<DHistory<DMedidas>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DMedidas>> result = service.buscarHistorico(1);

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
