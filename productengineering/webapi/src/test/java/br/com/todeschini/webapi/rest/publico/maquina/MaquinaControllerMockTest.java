package br.com.todeschini.webapi.rest.publico.maquina;

import br.com.todeschini.domain.business.publico.maquina.DMaquina;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.util.tests.MaquinaFactory;
import br.com.todeschini.persistence.publico.maquina.CrudMaquinaImpl;
import br.com.todeschini.webapi.BaseControllerIT;
import br.com.todeschini.webapi.ValidationConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import static br.com.todeschini.webapi.DuplicatedConstants.stringDuplicada;
import static org.mockito.Mockito.doThrow;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class MaquinaControllerMockTest extends BaseControllerIT<DMaquina> {

    @MockBean
    private CrudMaquinaImpl crud;

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/maquina");

        factoryObject = MaquinaFactory.createDMaquina();
        duplicatedObject = MaquinaFactory.createDuplicatedDMaquina(stringDuplicada);
        nonExistingObject = MaquinaFactory.createNonExistingDMaquina(nonExistingId);

        setCrudBehavior(factoryObject, nonExistingObject, crud);

        // custom duplicated
        doThrow(RegistroDuplicadoException.class).when(crud).pesquisarPorNome(stringDuplicada);
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
        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setNome(null);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setNome(ValidationConstants.branco);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setNome(ValidationConstants.especiais);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setNome(ValidationConstants.tamanhoMenor);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setNome(ValidationConstants.tamanhoMaior);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setFormula(null);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setValor(null);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setValor(ValidationConstants.doubleNegativo);
        validate(factoryObject);

        factoryObject = MaquinaFactory.createDMaquina();
        factoryObject.setGrupoMaquina(null);
        validate(factoryObject);
    }
}
