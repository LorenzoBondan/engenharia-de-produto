package br.com.todeschini.webapi.rest.publico.materialusado;

import br.com.todeschini.domain.business.publico.materialusado.DMaterialUsado;
import br.com.todeschini.domain.exceptions.RegistroDuplicadoException;
import br.com.todeschini.domain.util.tests.MaterialUsadoFactory;
import br.com.todeschini.persistence.publico.materialusado.CrudMaterialUsadoImpl;
import br.com.todeschini.webapi.BaseControllerIT;
import br.com.todeschini.webapi.ValidationConstants;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import static br.com.todeschini.webapi.DuplicatedConstants.idDuplicado;
import static org.mockito.Mockito.doThrow;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
public class MaterialUsadoControllerMockTest extends BaseControllerIT<DMaterialUsado> {

    @MockBean
    private CrudMaterialUsadoImpl crud;

    @BeforeEach
    void setUp() throws Exception {
        setConfiguration("/api/materialusado");

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        duplicatedObject = MaterialUsadoFactory.createDuplicatedDMaterialUsado(idDuplicado);
        nonExistingObject = MaterialUsadoFactory.createNonExistingDMaterialUsado(nonExistingId);

        setCrudBehavior(factoryObject, nonExistingObject, crud);

        // custom duplicated
        doThrow(RegistroDuplicadoException.class).when(crud).pesquisarPorFilhoEMaterial(idDuplicado, idDuplicado);
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
        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setMaterial(null);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setFilho(null);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setQuantidadeLiquida(null);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setQuantidadeLiquida(ValidationConstants.doubleNegativo);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setQuantidadeBruta(null);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setQuantidadeBruta(ValidationConstants.doubleNegativo);
        validate(factoryObject);

        factoryObject = MaterialUsadoFactory.createDMaterialUsado();
        factoryObject.setValor(ValidationConstants.doubleNegativo);
        validate(factoryObject);
    }
}
