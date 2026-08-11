package br.com.todeschini.webapi.rest.publico.material;

import br.com.todeschini.domain.business.publico.material.DMaterial;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.util.tests.MaterialFactory;
import br.com.todeschini.persistence.publico.material.CrudMaterialImpl;
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
public class MaterialControllerMockTest extends BaseControllerIT<DMaterial> {

    @MockBean
    private CrudMaterialImpl crud;

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/material");

        factoryObject = MaterialFactory.createDMaterial();
        duplicatedObject = MaterialFactory.createDuplicatedDMaterial(stringDuplicada);
        nonExistingObject = MaterialFactory.createNonExistingDMaterial(nonExistingId);

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
        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setDescricao(null);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setDescricao(ValidationConstants.branco);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setDescricao(ValidationConstants.especiais);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setDescricao(ValidationConstants.tamanhoMenor);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setDescricao(ValidationConstants.tamanhoMaior);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setTipoMaterial(null);
        validate(factoryObject);

        /*factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setImplantacao(ValidationConstants.dataPassada);
        validate(factoryObject);*/

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setPorcentagemPerda(null);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setPorcentagemPerda(ValidationConstants.doubleNegativo);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setValor(null);
        validate(factoryObject);

        factoryObject = MaterialFactory.createDMaterial();
        factoryObject.setValor(ValidationConstants.doubleNegativo);
        validate(factoryObject);
    }
}
