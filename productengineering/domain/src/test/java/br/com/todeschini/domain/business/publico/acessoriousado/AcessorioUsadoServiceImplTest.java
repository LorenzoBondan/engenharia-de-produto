package br.com.todeschini.domain.business.publico.acessoriousado;

import br.com.todeschini.domain.ConversaoValores;
import br.com.todeschini.domain.business.enums.DSituacaoEnum;
import br.com.todeschini.domain.PageableRequest;
import br.com.todeschini.domain.Paged;
import br.com.todeschini.domain.business.publico.acessorio.DAcessorio;
import br.com.todeschini.domain.business.publico.acessoriousado.spi.CrudAcessorioUsado;
import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.business.publico.history.DHistory;
import br.com.todeschini.domain.exceptions.BadRequestException;
import br.com.todeschini.domain.exceptions.ResourceNotFoundException;
import br.com.todeschini.domain.exceptions.UniqueConstraintViolationException;
import br.com.todeschini.domain.util.tests.AcessorioUsadoFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AcessorioUsadoServiceImplTest {

    private CrudAcessorioUsado crud;
    private ConversaoValores conversaoValores;
    private AcessorioUsadoServiceImpl service;

    @BeforeEach
    void setup() {
        crud = mock(CrudAcessorioUsado.class);
        conversaoValores = mock(ConversaoValores.class);
        service = new AcessorioUsadoServiceImpl(crud, conversaoValores);
    }

    @Test
    void deveBuscarTodos() {
        PageableRequest request = new PageableRequest(1,1,null,null,null,null,null);
        Paged<DAcessorioUsado> pagedResult = new Paged<>();
        when(crud.buscarTodos(request)).thenReturn(pagedResult);

        Paged<DAcessorioUsado> result = service.buscar(request);

        assertNotNull(result);
        verify(crud, times(1)).buscarTodos(request);
    }

    @Test
    void deveBuscarPorId() {
        DAcessorioUsado AcessorioUsado = AcessorioUsadoFactory.createDAcessorioUsado();
        when(crud.buscar(1)).thenReturn(AcessorioUsado);

        DAcessorioUsado result = service.buscar(AcessorioUsado.getCodigo());

        assertNotNull(result);
        verify(crud, times(1)).buscar(AcessorioUsado.getCodigo());
    }

    @Test
    void deveIncluir() {
        DAcessorioUsado domain = AcessorioUsadoFactory.createDAcessorioUsado();

        when(crud.pesquisarPorAcessorioEFilho(domain.getAcessorio().getCodigo(), domain.getFilho().getCodigo())).thenReturn(List.of());
        when(crud.inserir(domain)).thenReturn(domain);

        DAcessorioUsado result = service.incluir(domain);

        assertNotNull(result);
        verify(crud, times(1)).inserir(domain);
    }

    @Test
    void deveLancarExcecaoAoIncluirDuplicado() {
        DAcessorioUsado domain = AcessorioUsadoFactory.createDuplicatedDAcessorioUsado(2);
        when(crud.pesquisarPorAcessorioEFilho(domain.getAcessorio().getCodigo(), domain.getFilho().getCodigo()))
                .thenReturn(List.of(new DAcessorioUsado(1, new DAcessorio(2), new DFilho(1),null,null,null,DSituacaoEnum.ATIVO)));

        assertThrows(UniqueConstraintViolationException.class, () -> service.incluir(domain));
        verify(crud, never()).inserir(any());
    }

    @Test
    void deveAtualizar() {
        DAcessorioUsado domain = AcessorioUsadoFactory.createDAcessorioUsado();

        when(crud.pesquisarPorAcessorioEFilho(domain.getAcessorio().getCodigo(), domain.getFilho().getCodigo())).thenReturn(List.of());
        when(crud.atualizar(domain)).thenReturn(domain);

        DAcessorioUsado result = service.atualizar(domain);

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

        DAcessorioUsado domain1 = AcessorioUsadoFactory.createDAcessorioUsado();
        DAcessorioUsado domain2 = AcessorioUsadoFactory.createDAcessorioUsado();
        domain2.setCodigo(2);

        Field updatedField = DAcessorioUsado.class.getDeclaredField("valor");

        when(crud.buscar(anyInt())).thenReturn(domain1, domain2);
        when(crud.atualizarEmLote(anyList())).thenReturn(List.of(domain1, domain2));
        when(conversaoValores.buscarCampoNaHierarquia(eq(DAcessorioUsado.class), eq("valor"))).thenReturn(updatedField);
        when(conversaoValores.convertValor(eq(Double.class), any())).thenAnswer(invocation -> invocation.getArgument(1));

        List<DAcessorioUsado> atualizados = service.atualizarEmLote(codigos, atributos, valores);

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

        DAcessorioUsado versaoAntiga = new DAcessorioUsado(versionId);
        versaoAntiga.setQuantidade(15);
        when(crud.substituirPorVersaoAntiga(id, versionId)).thenReturn(versaoAntiga);

        DAcessorioUsado substituido = service.substituirPorVersaoAntiga(id, versionId);

        assertNotNull(substituido);
        assertEquals(15, substituido.getQuantidade());
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
        List<DHistory<DAcessorioUsado>> historico = List.of();
        when(crud.buscarHistorico(1)).thenReturn(historico);

        List<DHistory<DAcessorioUsado>> result = service.buscarHistorico(1);

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
