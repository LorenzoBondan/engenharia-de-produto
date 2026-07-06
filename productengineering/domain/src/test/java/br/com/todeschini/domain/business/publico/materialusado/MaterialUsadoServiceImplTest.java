package br.com.todeschini.domain.business.publico.materialusado;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.business.publico.materialusado.spi.CrudMaterialUsado;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.util.tests.MaterialUsadoFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MaterialUsadoServiceImplTest {

    private CrudMaterialUsado crud;
    private ConversaoValores conversaoValores;
    private MaterialUsadoServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudMaterialUsado.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new MaterialUsadoServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DMaterialUsado> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DMaterialUsado> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DMaterialUsado MaterialUsado = MaterialUsadoFactory.createDMaterialUsado();
        when(crud.buscar(1)).thenReturn(MaterialUsado);

        DMaterialUsado result = service.buscar(MaterialUsado.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(MaterialUsado.getCodigo());
    }

    @Test
    void deveIncluir() {
        DMaterialUsado domain = MaterialUsadoFactory.createDMaterialUsado();

        when(crud.pesquisarPorFilhoEMaterial(domain.getFilho().getCodigo(), domain.getMaterial().getCodigo())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DMaterialUsado result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DMaterialUsado domain = MaterialUsadoFactory.createDuplicatedDMaterialUsado(2);
        when(crud.pesquisarPorFilhoEMaterial(domain.getFilho().getCodigo(), domain.getMaterial().getCodigo()))
                .thenReturn(List.of(new DMaterialUsado(1, new DFilho(1), new DMaterial(2), null,null,null,null,DSituacaoEnum.ATIVO)));

        assertThrows(UniqueConstraintViolationException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DMaterialUsado domain = MaterialUsadoFactory.createDMaterialUsado();

        when(crud.pesquisarPorFilhoEMaterial(domain.getFilho().getCodigo(), domain.getMaterial().getCodigo())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DMaterialUsado result = service.atualizar(domain);

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

        DMaterialUsado domain1 = MaterialUsadoFactory.createDMaterialUsado();
        DMaterialUsado domain2 = MaterialUsadoFactory.createDMaterialUsado();
        domain2.setCodigo(2);

        Field updatedField = DMaterialUsado.class.getDeclaredField("valor");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DMaterialUsado.class), eq("valor"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DMaterialUsado> atualizados = service.atualizarEmLote(codigos, atributos, valores);

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

        DMaterialUsado versaoAntiga = new DMaterialUsado(versionId);
        versaoAntiga.setQuantidadeLiquida(15.0);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DMaterialUsado substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
        assertEquals(15.0, substituido.getQuantidadeLiquida());
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
        List<DHistory<DMaterialUsado>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DMaterialUsado>> result = service.buscarHistorico(1);

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
