package br.com.todeschini.domain.business.publico.pinturabordafundo;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.pinturabordafundo.spi.CrudPinturaBordaFundo;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.util.tests.PinturaBordaFundoFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PinturaBordaFundoServiceImplTest {

    private CrudPinturaBordaFundo crud;
    private ConversaoValores conversaoValores;
    private PinturaBordaFundoServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudPinturaBordaFundo.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new PinturaBordaFundoServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DPinturaBordaFundo> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DPinturaBordaFundo> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DPinturaBordaFundo domain = PinturaBordaFundoFactory.createDPinturaBordaFundo();
        when(crud.buscar(1)).thenReturn(domain);

        DPinturaBordaFundo result = service.buscar(domain.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(domain.getCodigo());
    }

    @Test
    void deveIncluir() {
        DPinturaBordaFundo domain = PinturaBordaFundoFactory.createDPinturaBordaFundo();

        when(crud.pesquisarPorDescricao(domain.getDescricao())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DPinturaBordaFundo result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DPinturaBordaFundo domain = PinturaBordaFundoFactory.createDuplicatedDPinturaBordaFundo("Duplicado");
        DPinturaBordaFundo existente = new DPinturaBordaFundo(1);
        existente.setSituacao(DSituacaoEnum.ATIVO);
        when(crud.pesquisarPorDescricao("Duplicado"))
                .thenReturn(List.of(existente));

        assertThrows(RegistroDuplicadoException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DPinturaBordaFundo domain = PinturaBordaFundoFactory.createDPinturaBordaFundo();

        when(crud.pesquisarPorDescricao(domain.getDescricao())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DPinturaBordaFundo result = service.atualizar(domain);

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

        DPinturaBordaFundo domain1 = PinturaBordaFundoFactory.createDPinturaBordaFundo();
        DPinturaBordaFundo domain2 = PinturaBordaFundoFactory.createDPinturaBordaFundo();
        domain2.setCodigo(2);

        Field updatedField = DMaterial.class.getDeclaredField("valor");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DPinturaBordaFundo.class), eq("valor"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DPinturaBordaFundo> atualizados = service.atualizarEmLote(codigos, atributos, valores);

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

        DPinturaBordaFundo versaoAntiga = new DPinturaBordaFundo(versionId);
        versaoAntiga.setDescricao("Versão Antiga");
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DPinturaBordaFundo substituido = service.substituirPorVersaoAntiga(id, versionId);

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
        List<DHistory<DPinturaBordaFundo>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DPinturaBordaFundo>> result = service.buscarHistorico(1);

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
