package br.com.todeschini.domain.business.publico.roteiromaquina;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.business.publico.roteiro.DRoteiro;
import br.com.todeschini.domain.business.publico.roteiromaquina.spi.CrudRoteiroMaquina;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.util.tests.RoteiroMaquinaFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RoteiroMaquinaServiceImplTest {

    private CrudRoteiroMaquina crud;
    private ConversaoValores conversaoValores;
    private RoteiroMaquinaServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudRoteiroMaquina.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new RoteiroMaquinaServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DRoteiroMaquina> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DRoteiroMaquina> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DRoteiroMaquina RoteiroMaquina = RoteiroMaquinaFactory.createDRoteiroMaquina();
        when(crud.buscar(1)).thenReturn(RoteiroMaquina);

        DRoteiroMaquina result = service.buscar(RoteiroMaquina.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(RoteiroMaquina.getCodigo());
    }

    @Test
    void deveIncluir() {
        DRoteiroMaquina domain = RoteiroMaquinaFactory.createDRoteiroMaquina();

        when(crud.pesquisarPorRoteiroEMaquina(domain.getRoteiro().getCodigo(), domain.getMaquina().getCodigo())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DRoteiroMaquina result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DRoteiroMaquina domain = RoteiroMaquinaFactory.createDuplicatedDRoteiroMaquina(2);
        when(crud.pesquisarPorRoteiroEMaquina(domain.getRoteiro().getCodigo(), domain.getMaquina().getCodigo()))
                .thenReturn(List.of(new DRoteiroMaquina(1, new DRoteiro(2), new DMaquina(2),null,null,null,DSituacaoEnum.ATIVO)));

        assertThrows(UniqueConstraintViolationException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DRoteiroMaquina domain = RoteiroMaquinaFactory.createDRoteiroMaquina();

        when(crud.pesquisarPorRoteiroEMaquina(domain.getRoteiro().getCodigo(), domain.getMaquina().getCodigo())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DRoteiroMaquina result = service.atualizar(domain);

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
        List<String> atributos = List.of("tempoMaquina");
        List<Object> valores = List.of(10.0);

        DRoteiroMaquina domain1 = RoteiroMaquinaFactory.createDRoteiroMaquina();
        DRoteiroMaquina domain2 = RoteiroMaquinaFactory.createDRoteiroMaquina();
        domain2.setCodigo(2);

        Field updatedField = DRoteiroMaquina.class.getDeclaredField("tempoMaquina");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DRoteiroMaquina.class), eq("tempoMaquina"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DRoteiroMaquina> atualizados = service.atualizarEmLote(codigos, atributos, valores);

        assertNotNull(atualizados);
        assertEquals(2, atualizados.size());
        assertEquals(10.0, atualizados.get(0).getTempoMaquina());
        assertEquals(10.0, atualizados.get(1).getTempoMaquina());

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

        DRoteiroMaquina versaoAntiga = new DRoteiroMaquina(versionId);
        versaoAntiga.setTempoMaquina(15.0);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DRoteiroMaquina substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
        assertEquals(15.0, substituido.getTempoMaquina());
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
        List<DHistory<DRoteiroMaquina>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DRoteiroMaquina>> result = service.buscarHistorico(1);

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
