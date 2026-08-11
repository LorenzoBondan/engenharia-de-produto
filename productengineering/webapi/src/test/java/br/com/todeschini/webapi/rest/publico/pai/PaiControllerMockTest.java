package br.com.todeschini.webapi.rest.publico.pai;

import br.com.todeschini.domain.business.publico.pai.DPai;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.util.tests.PaiFactory;
import br.com.todeschini.persistence.publico.pai.CrudPaiImpl;
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
public class PaiControllerMockTest extends BaseControllerIT<DPai> {

    @MockBean
    private CrudPaiImpl crud;

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/pai");

        factoryObject = PaiFactory.createDPai();
        duplicatedObject = PaiFactory.createDuplicatedDPai(stringDuplicada);
        nonExistingObject = PaiFactory.createNonExistingDPai(nonExistingId);

        setCrudBehavior(factoryObject, nonExistingObject, crud);

        // custom duplicated
        doThrow(RegistroDuplicadoException.class).when(crud).pesquisarPorDescricao(stringDuplicada);
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
        factoryObject = PaiFactory.createDPai();
        factoryObject.setModelo(null);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setCategoriaComponente(null);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setDescricao(null);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setDescricao(ValidationConstants.branco);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setDescricao(ValidationConstants.especiais);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setDescricao(ValidationConstants.tamanhoMenor);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setDescricao(ValidationConstants.tamanhoMaior);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setBordasComprimento(ValidationConstants.intNegativo);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setBordasLargura(ValidationConstants.intNegativo);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setNumeroCantoneiras(ValidationConstants.intNegativo);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setPlasticoAdicional(ValidationConstants.doubleNegativo);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setLarguraPlastico(ValidationConstants.intNegativo);
        validate(factoryObject);

        factoryObject = PaiFactory.createDPai();
        factoryObject.setFaces(ValidationConstants.intNegativo);
        validate(factoryObject);
    }
}
