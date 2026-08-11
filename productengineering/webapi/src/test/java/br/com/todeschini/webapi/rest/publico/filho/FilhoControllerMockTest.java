package br.com.todeschini.webapi.rest.publico.filho;

import br.com.todeschini.domain.business.publico.filho.DFilho;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.util.tests.FilhoFactory;
import br.com.todeschini.persistence.publico.filho.CrudFilhoImpl;
import br.com.todeschini.webapi.BaseControllerIT;
import br.com.todeschini.webapi.ValidationConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import static br.com.todeschini.webapi.DuplicatedConstants.idDuplicado;
import static br.com.todeschini.webapi.DuplicatedConstants.stringDuplicada;
import static org.mockito.Mockito.doThrow;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class FilhoControllerMockTest extends BaseControllerIT<DFilho> {

    @MockBean
    private CrudFilhoImpl crud;

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/filho");

        factoryObject = FilhoFactory.createDFilho();
        duplicatedObject = FilhoFactory.createDuplicatedDFilho(stringDuplicada, idDuplicado);
        nonExistingObject = FilhoFactory.createNonExistingDFilho(nonExistingId);

        setCrudBehavior(factoryObject, nonExistingObject, crud);

        // custom duplicated
        doThrow(RegistroDuplicadoException.class).when(crud).pesquisarPorDescricaoECorEMedidas(stringDuplicada, idDuplicado, idDuplicado);
    }

    @Test
    public void pesquisarTodosShouldReturnPagedListTest() throws Exception {
        pesquisarTodosShouldReturnPagedList();
    }

    @Test
    public void pesquisarPorIdShouldReturnObjectTest() throws Exception {
        pesquisarPorIdShouldReturnObject();
    }

    @Test
    public void pesquisarPorIdShouldThrowResourceNotFoundExceptionWhenIdDoesNotExistsTest() throws Exception {
        pesquisarPorIdShouldThrowResourceNotFoundExceptionWhenIdDoesNotExists();
    }

    @Test
    public void pesquisarHistoricoShouldReturnHistoryListTest() throws Exception {
        pesquisarHistoricoShouldReturnHistoryList();
    }

    @Test
    public void criarShouldReturnObjectTest() throws Exception {
        criarShouldReturnObject();
    }

    @Test
    public void criarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescriptionTest() throws Exception {
        criarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescription();
    }

    @Test
    public void atualizarShouldReturnOkWhenValidDataTest() throws Exception {
        atualizarShouldReturnOkWhenValidData();
    }

    @Test
    public void atualizarShouldThrowResourceNotFoundExceptionWhenObjectIdDoesNotExistsTest() throws Exception {
        atualizarShouldThrowResourceNotFoundExceptionWhenObjectIdDoesNotExists();
    }

    @Test
    public void atualizarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescriptionTest() throws Exception {
        atualizarShouldThrowRegistroDuplicadoExceptionWhenObjectHasDuplicatedDescription();
    }

    @Test
    public void substituirPorVersaoAntigaShouldReturnObjectTest() throws Exception {
        substituirPorVersaoAntigaShouldReturnObject();
    }

    @Test
    public void substituirPorVersaoAntigaShouldThrowResourceNotFoundExceptionWhenIdDoesNotExistsTest() throws Exception {
        substituirPorVersaoAntigaShouldThrowResourceNotFoundExceptionWhenIdDoesNotExists();
    }

    @Test
    public void inativarShouldReturnOkWhenIdExistsTest() throws Exception {
        inativarShouldReturnOkWhenIdExists();
    }

    @Test
    public void inativarShouldThrowPartialContentExceptionWhenIdDoesNotExistsTest() throws Exception {
        inativarShouldThrowPartialContentExceptionWhenIdDoesNotExists();
    }

    @Test
    public void deletarShouldReturnOkWhenIdExistsTest() throws Exception {
        deletarShouldReturnOkWhenIdExists();
    }

    @Test
    public void deletarShouldThrowPartialContentExceptionWhenIdDoesNotExistsTest() throws Exception {
        deletarShouldThrowPartialContentExceptionWhenIdDoesNotExists();
    }

    @Test
    public void validationShouldThrowUnprocessableEntityWhenInvalidDataTest() throws Exception {
        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setDescricao(null);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setDescricao(ValidationConstants.branco);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setDescricao(ValidationConstants.especiais);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setDescricao(ValidationConstants.tamanhoMenor);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setDescricao(ValidationConstants.tamanhoMaior);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setCor(null);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setMedidas(null);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setImplantacao(ValidationConstants.dataPassada);
        validate(factoryObject);

        factoryObject = FilhoFactory.createDFilho();
        factoryObject.setValor(ValidationConstants.doubleNegativo);
        validate(factoryObject);
    }
}
